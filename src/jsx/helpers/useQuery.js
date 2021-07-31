import { useQuery as useReactQuery, useMutation as useReactMutation } from 'react-query';

export const useQuery = (key, fn, options = {}) => {
   const query = useReactQuery(key, fn, { ...options, keepPreviousData: true, retry: false });
   return query;
};

export const useMutation = (fn, options = {}) => {
   const mutation = useReactMutation(fn, { ...options, retry: false });
   return mutation;
};
