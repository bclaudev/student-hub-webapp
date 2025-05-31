import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSemester = async () => {
      try {
        const res = await fetch("http://localhost:8787/api/semesters", {
          credentials: "include",
        });
        const data = await res.json();

        if (
          !data ||
          !Array.isArray(data.semesters) ||
          data.semesters.length === 0
        ) {
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
