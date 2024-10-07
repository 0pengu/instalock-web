export const generateKey = async () => {
  const res = await fetch("/api/jwt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    return true;
  }
  return false;
};
