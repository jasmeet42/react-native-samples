import news from '../../../model/news';
import MD5 from 'crypto-js/md5';
import AsyncStorage from '@react-native-async-storage/async-storage';
// or for stronger hashing:


export const saveArticle = async (article: news) => {
  try {
    console.log('Saving article:', JSON.stringify(article));
    const key = MD5(article.url).toString();
    await AsyncStorage.setItem(key, JSON.stringify(article));
  } catch (e) {
    console.error('Error saving data', e);
  }
};
export const saveArticles = async (article: news[]) => {
  console.log(`Saving ${article.length} articles`);
  const keyList: string[] = [];
  let key;
  await Promise.all(article.map(a => {
    key = MD5(a.url).toString();
    keyList.push(key);
    saveArticle(a)
  }));
  const ids = await AsyncStorage.getItem('article-ids');
  const idList = ids ? JSON.parse(ids) : []
  keyList.forEach(key => {
    if (!idList.includes(key)) {
      idList.push(key);
    }
  });
  await AsyncStorage.setItem('article-ids', JSON.stringify(idList));
  console.log('Updated article IDs:', JSON.stringify(idList));

}

export const removeArticles = async () => {
  try {
    const ids = await AsyncStorage.getItem('article-ids');
    if (!ids) return;
    const idArray: string[] = JSON.parse(ids);
    await Promise.all(idArray.map(async (element: string) => {
      await AsyncStorage.removeItem(element);
    }));
    await AsyncStorage.removeItem('article-ids');
  }
  catch (e) {
    console.error('Error removing srticles', e);
  }
}

export const getAllArticles = async () => {
  try {
    const ids = await AsyncStorage.getItem('article-ids');
    if (!ids) return [];
    console.log('Article IDs:', ids);
    const entries = await AsyncStorage.multiGet(JSON.parse(ids));
    return entries.map(([key, value]) => {
      console.log('Retrieved article:', value);
      return value ? JSON.parse(value) : null;
    });
  }
  catch (e) {
    console.error('Error getting srticles', e);
  }
};
