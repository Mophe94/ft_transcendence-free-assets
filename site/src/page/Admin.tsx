// import { useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import RegularBG from "../background/RegularBg";

export default function Admin() {

  // const context = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const user = context.user;

  //   if (!user || user.role !== "admin") {
  //     navigate("/");
  //   }

  // }, [context.user, navigate]);


  return (
    <RegularBG>

      <div className="p-8">

        <div className="
          overflow-hidden
          rounded-xl
          border-2
          border-[#8d6239]
          bg-[#f7f0d5]
          shadow-xl
        ">

          <iframe
            src="/grafana/d/swarm-health/swarm-cluster-health?kiosk&refresh=10s"
            className="
              h-[900px]
              w-full
            "
            title="Grafana Dashboard"
          />

        </div>

      </div>

    </RegularBG>
  );
}