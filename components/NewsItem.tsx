import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Props } from "../NewsReader";

const NewsItem = memo(({ title, description, imageUrl }: Props) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.item}>
      <View style={{ width: '100%', height: 250, justifyContent: 'center', alignItems: 'center' }}>
        {loading && (
          <ActivityIndicator size="small" color="#888" style={{ position: 'absolute', alignSelf: 'center' }} />
        )}
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

export default NewsItem;
const styles = StyleSheet.create({
  item: {
    padding: 20
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
