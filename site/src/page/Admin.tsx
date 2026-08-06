import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RegularBG from "../background/RegularBg";

export default function Admin() {
 // const context = useAuth();
 // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = context.user;
  //   if (!user || user.role !== "admin") navigate("/");
  // }, [context.user, navigate]);

  // Replace with your Grafana/Prometheus/Loki API
  const [stats] = useState({
    players: 143,
    games: 28,
    cpu: 18,
    memory: 42,
    uptime: "12d 7h",
  });

  const [logs] = useState([
    { level: "INFO", message: "Player Arthur connected" },
    { level: "INFO", message: "Game #204 started" },
    { level: "WARN", message: "Slow database query (420ms)" },
    { level: "ERROR", message: "API timeout on matchmaking" },
    { level: "INFO", message: "Backup completed successfully" },
  ]);

  return (
    <RegularBG>
      <div className="mx-auto max-w-6xl px-8 py-10">

          <h1
            className="mb-8 text-5xl text-[#5b3520]"
            style={{ fontFamily: "MedievalSharp, serif" }}
          >
            Kingdom Administration
          </h1>

          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

            <StatCard
              title="👥 Adventurers"
              value={stats.players}
            />

            <StatCard
              title="🎮 Active Games"
              value={stats.games}
            />

            <StatCard
              title="⚙ CPU"
              value={`${stats.cpu}%`}
            />

            <StatCard
              title="💾 Memory"
              value={`${stats.memory}%`}
            />

            <StatCard
              title="🏰 Uptime"
              value={stats.uptime}
            />

          </div>

          {/* Server Health */}
          <div className="mt-8 rounded-lg border border-[#8d6239] bg-[#ece6c7] p-6">

            <h2
              className="mb-4 text-3xl text-[#5b3520]"
              style={{ fontFamily: "MedievalSharp, serif" }}
            >
              Server Health
            </h2>

            <div className="mb-2 flex justify-between font-semibold text-[#5b3520]">
              <span>CPU Usage</span>
              <span>{stats.cpu}%</span>
            </div>

            <div className="h-5 overflow-hidden rounded-full border border-[#8d6239] bg-[#d9cfa8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-700 to-green-500"
                style={{ width: `${stats.cpu}%` }}
              />
            </div>

            <div className="mt-6 mb-2 flex justify-between font-semibold text-[#5b3520]">
              <span>Memory Usage</span>
              <span>{stats.memory}%</span>
            </div>

            <div className="h-5 overflow-hidden rounded-full border border-[#8d6239] bg-[#d9cfa8]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-500"
                style={{ width: `${stats.memory}%` }}
              />
            </div>

          </div>

          {/* Logs */}
          <div className="mt-8 rounded-lg border border-[#8d6239] bg-[#ece6c7] p-6">

            <h2
              className="mb-5 text-3xl text-[#5b3520]"
              style={{ fontFamily: "MedievalSharp, serif" }}
            >
              Royal Chronicle
            </h2>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded border border-[#c6b788] bg-[#f7f2dc] p-4 font-mono">

              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`rounded px-3 py-2 ${
                    log.level === "ERROR"
                      ? "bg-red-100 text-red-700"
                      : log.level === "WARN"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <span className="mr-2 font-bold">
                    {log.level}
                  </span>

                  {log.message}
                </div>
              ))}

            </div>

          </div>
      </div>
    </RegularBG>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg border border-[#8d6239] bg-[#ece6c7] p-5 text-center shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-bold uppercase tracking-wide text-[#6b4c2b]">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#2e2416]">
        {value}
      </p>
    </div>
  );
}
