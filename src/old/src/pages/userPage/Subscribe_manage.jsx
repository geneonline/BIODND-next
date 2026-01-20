import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import loadingImg from "@/assets/img/loading.png";
const Subscribe_manage = () => {
  const token = localStorage.getItem("token");
  const { userData } = useUser(token);
  const [plan, setPlan] = useState();
  const [isManagePortalLoading, setIsManagePortalLoading] = useState(false);
  const { createStripeCustomerPortal } = useAuth();

  useEffect(() => {
    if (userData?.subscriptionLevel === "Pro") {
      setPlan("Pro");
    } else if (userData?.subscriptionLevel === "Test") {
      setPlan("Test");
    } else if (userData) {
      setPlan("Free");
    } else {
      setPlan("visitor");
    }
  }, [userData]);

  const handleManageSubscriptionClick = async () => {
    if (!userData) {
      navigate("/account/login");
      return;
    }
    setIsManagePortalLoading(true);
    try {
      const result = await createStripeCustomerPortal();
      if (result) {
        window.location.href = result;
      } else {
        toast.error(
          "Unable to get Stripe portal link, please try again later."
        );
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to open portal, please try again later"
      );
    } finally {
      setIsManagePortalLoading(false);
    }
  };

  return (
    <main className="pt-32 sm:pt-38 pb-16 bg-interface-background">
      <div className="w-full flex flex-col items-center ">
        <h2 className="text-24px sm:text-36px font-bold pb-10 leading-140">
          Manage Subscription
        </h2>
        <div className="text-textColor-secondary text-xl leading-140 pb-2">
          Current Plan :{" "}
        </div>
        <div className="text-24px py-2.5 px-6 bg-Neon-Green-light text-primaryBlue-600 rounded-full mb-10 font-bold">
          BIODND {plan}
        </div>

        <button
          onClick={handleManageSubscriptionClick}
          disabled={isManagePortalLoading}
          aria-busy={isManagePortalLoading}
          className=" text-xl text-textColor-secondary underline mb-10"
        >
          {"See billing details"}
        </button>

        <div className="w-full flex flex-col justify-center sm:flex-row gap-4 px-8">
          <Link
            to="/subscribe"
            className="w-full sm:w-fit text-white bg-primary-default hover:bg-primary-hovered rounded-full text-center py-3 px-10"
          >
            Price Page
          </Link>

          <button
            onClick={handleManageSubscriptionClick}
            disabled={isManagePortalLoading}
            aria-busy={isManagePortalLoading}
            className="w-full sm:w-fit text-primary-default bg-none border border-primary-default hover:bg-primaryBlue-200 rounded-full text-center py-3 px-10"
          >
            {"Cancel Plan"}
          </button>
        </div>

        {/* loading img */}
        {isManagePortalLoading && (
          <img className=" animate-spin mt-10" src={loadingImg} alt="" />
        )}
      </div>
    </main>
  );
};

export default Subscribe_manage;
