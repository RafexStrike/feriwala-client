"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "@/lib/api/customer";
import type { Cart, CartItem } from "@/types/api";

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => addToCart({ productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => updateCartItem(productId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0) ?? 0;

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMutation.mutate(productId);
    } else {
      updateMutation.mutate({ productId, quantity });
    }
  };

  const removeItem = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const clear = () => {
    clearMutation.mutate();
  };

  return {
    cart,
    isLoading,
    itemCount,
    subtotal,
    addItem: addMutation.mutate,
    updateQuantity,
    removeItem,
    clearCart: clear,
    refetch,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}