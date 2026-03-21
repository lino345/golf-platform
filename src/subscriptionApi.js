import { supabase } from "./supabaseClient";

// 🔄 Activate subscription
export const activateSubscription = async (userId) => {
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert([
      {
        user_id: userId,
        status: "active",
        renewal_date: renewalDate,
      },
    ]);

  if (error) throw error;
  return data;
};

// 📊 Get subscription
export const getSubscription = async (userId) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
};