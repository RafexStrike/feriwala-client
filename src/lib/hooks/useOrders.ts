import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrder } from "@/lib/api/customer";
import type { Order } from "@/types/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    retry: false,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    retry: false,
  });
}