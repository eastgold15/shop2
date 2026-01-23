import { useQuery } from '@tanstack/react-query';

// 1. Extract the request parameters type from the RPC method
type SiteConfigParams = Parameters<typeof rpc["site-config"]["get"]>[0];

// 2. Extract and clean the response data type
export type SiteConfigListRes = NonNullable<Treaty.Data<typeof rpc["site-config"]["get"]>>;

/**
 * Custom hook to fetch Site Configuration list
 * @param params - API request parameters (query/path/body)
 * @param enabled - Manual toggle for the query (useful for dependent queries)
 */
export function useSiteConfigList(
          params?: SiteConfigParams,
          enabled = true
) {
          return useQuery({
                    // Ensure the queryKey changes when params change to trigger a refetch
                    queryKey: siteconfigKeys.list(params),
                    queryFn: async () => {
                              const response = await rpc["site-config"].get(params);
                              // Depending on your RPC client, you might need to handle errors or return .data
                              return response.data;
                    },
                    enabled: enabled && !!params, // Optional: only run if enabled AND params exist
          });
}