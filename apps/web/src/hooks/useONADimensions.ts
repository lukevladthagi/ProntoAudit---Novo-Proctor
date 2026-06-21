import { useEffect, useState } from "react";

interface ONADimension {
  dimension: number;
  percentage: number;
  conformes: number;
  parciais: number;
  naoConformes: number;
}

export function useONADimensions() {
  const [dimensions, setDimensions] = useState<ONADimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/ona-dimensions")
      .then((res) => res.json())
      .then((data) => {
        setDimensions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { dimensions, loading, error };
}
