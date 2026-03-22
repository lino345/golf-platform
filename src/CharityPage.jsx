import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./Navbar";

export default function CharityPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    const { data, error } = await supabase
      .from("charities")
      .select("*");

    if (error) {
      console.error(error);
    }

    setCharities(data || []);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>❤️ Supported Charities</h1>

        {loading ? (
          <p>Loading charities...</p>
        ) : charities.length === 0 ? (
          <p>No charities available</p>
        ) : (
          <div className="grid">
            {charities.map((c) => (
              <div key={c.id} className="card">
                <h2>{c.name}</h2>
                <p>{c.description}</p>

                {/* optional future feature */}
                <button>Select Charity</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}