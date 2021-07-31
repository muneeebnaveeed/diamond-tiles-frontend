import { useQuery as useReactQuery } from 'react-query';

export const useQuery = (key, fn, options = {}) => {
   const query = useReactQuery(key, fn, { ...options, keepPreviousData: true, retry: false });
   return query;
};
