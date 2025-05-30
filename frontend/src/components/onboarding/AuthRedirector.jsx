import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSemester = async () => {
      try {
        const res = await fetch("http://localhost:8787/api/semesters/get", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data || !data.startDate || !data.endDate) {
          navigate("/onboarding");
        } else {
          navigate("/calendar");
        }
      } catch (err) {
        console.error("Eroare la verificarea semestrului:", err);
        navigate("/onboarding");
      }
    };

    checkSemester();
  }, [navigate]);

  return null;
}
