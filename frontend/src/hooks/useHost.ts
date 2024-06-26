import { useQuery } from "@tanstack/react-query";
import { keys } from "./queryKeys";
import { getHostById } from "../services/host";

/**
 * hook meant to fetch a host using react-query in order
 * to cache data and avoid unnecessary queries to be made
 * to firestore
 *
 * @param {String} hostId of the host we want to fetch
 * @param {Object} options to be passed along to useQuery
 * @returns
 */
export const useHost = (hostId: string | null, options = {}) => {
  return useQuery(
    keys.host(hostId),
    () => {
      if (!hostId) {
        return null;
      }
      return getHostById(hostId);
    },
    options,
  );
};
