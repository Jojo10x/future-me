import { User } from "@/types/user";

export const getUser = async (): Promise<User | null> => {

  const API = 'https://future-me.onrender.com';

  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await fetch(`${API}/api/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (userData: {
  full_name?: string;
  email?: string;
}): Promise<User> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  const API = 'https://future-me.onrender.com';

  const response = await fetch(`${API}/api/profile/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Update error details:", errorData);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};