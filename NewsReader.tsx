import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NEWS_API_KEY } from '@env';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import useFetch from './hooks/useFetch';
import Config from './network/config';
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import news from './model/news';
import NewsResponse from './model/newsResponse';
import { saveArticles, getAllArticles, removeArticles } from './repositoy/news-repository';
import FastImage from '@d11/react-native-fast-image';
import commonStyles from './styles';
import NewsItem from './components/NewsItem';

function NewsReader() {
  const [params, setParams] = useState({
    pageSize: Config.PAGE_SIZE,
    page: 1,
    apiKey: NEWS_API_KEY
  });
  const [articles, setArticles] = useState<news[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const lastSavedPage = useRef<number | null>(null);


  useEffect(() => {
    getAllArticles().then((savedArticles: news[] | undefined) => {
      console.log('📰 Retrieved Articles:', savedArticles);
      if (savedArticles && savedArticles.length > 0) {
        console.log("Loaded articles from storage: " + savedArticles.length);
        setArticles(savedArticles);
        setShouldFetch(false);
      } else {
        console.log("No articles in storage, fetching from API.");
        setShouldFetch(true);
      }
    });
  }, []);
  const { data, loading, error, refreshing, refetch, hasMore } = useFetch<NewsResponse>({
    url: shouldFetch ? `${Config.NEWS_API_URL}` : null, params
  });
  useEffect(() => {
    if (data && data.articles && params.page !== lastSavedPage.current) {
      console.log("Fetched articles from API: " + data.articles.length);
      lastSavedPage.current = params.page;
      if (params.page === 1) {
        setArticles(data.articles);
        removeArticles().then(() => {
        saveArticles(data.articles);
        });
      } else {
        setArticles(prev => {
          const newArticles = [...prev, ...data.articles];
          saveArticles(data.articles);
          return newArticles;
        });
      }
    }
  }, [data]);


  function refreshData(): void {
    setParams({ ...params, page: 1 });
    lastSavedPage.current = null;
    setShouldFetch(true);
    refetch();
  }

  const renderNewsItem = useCallback(
    ({ item }: { item: news }) => (
      <NewsItem
        title={item.title}
        description={item.description}
        imageUrl={item.urlToImage}
      />
    ),
    []
  );

  return (
    <SafeAreaProvider>
      {error && <Text style={commonStyles.errorText}>🚨 Error: {error}</Text>}
      <FlatList
        data={articles || []}
        keyExtractor={(item) => item.url}
        refreshing={refreshing}
        onRefresh={refreshData}
        onEndReached={!loading && !refreshing && hasMore ? (() => {
          setParams({ ...params, page: params.page + 1 });
          console.log("End reached, loading more..." + params.page);
        }) : null}
        onEndReachedThreshold={0.2}
        getItemLayout={(_, index) => ({
          length: 280, // image height + padding
          offset: 280 * index,
          index,
        })}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#000000" /> : null
        }
        ItemSeparatorComponent={(() => <View style={styles.separator} />)}
        renderItem={renderNewsItem}
      />
    </SafeAreaProvider>
  );
}

export type Props = {
  title: string,
  description: string,
  imageUrl: string
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default NewsReader;
