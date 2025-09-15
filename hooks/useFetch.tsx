import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Config from '../network/config';

type Props = {
    url: string|null,
    params?: any
}

const useFetch = <T,>({ url, params }: Props) => {
    console.log("useFetch called with URL: " + url + " and params: " + JSON.stringify(params));
    const isMounted = useRef(true);
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fallbackMessage = "Something went wrong. Please try again later."
    const fetchData = useCallback((isRefresh = false) => {

        console.log(url);
        setError(null);
        if (!url) return;
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        axios.get(url, {
            params: { ...params }
        })
            .then(response => {
                console.log("Response received: ", response);
                if (response.status != 200) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                if (isMounted.current) {
                    if (response.data.articles && response.data.articles.length < Config.PAGE_SIZE) {
                        setHasMore(false);
                    }

                    setData(response.data);
                }
            })
            .catch(error => {
                if (!isMounted) return; // Prevent state update if unmounted
                console.error(error)
                setError(error?.message || fallbackMessage);
            })
            .finally(() => {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setLoading(false);
                }
            })
    }, [url, params]);

    useEffect(() => {
        isMounted.current = true;
        console.log("useEffect called " + JSON.stringify(params));
        fetchData();
        return () => {
            isMounted.current = false; // Cleanup: mark as unmounted
        };
    }, [url, params]);

    const refetch = useCallback(() => {
        setHasMore(true);
        fetchData(true);
    },[fetchData]);

    const loadMore = useCallback(() => {
        console.log("loadMore called");
        fetchData();
    },[fetchData]);

    return { data, loading, error, refreshing, refetch, loadMore, hasMore };
};


export default useFetch;


