import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHelmet from "@/widgets/PageHelmet";

const Database = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full pt-22 bg-interface-background min-h-screen">
      <PageHelmet
        pageTitle={t("head.database.title")}
        pageDescription={t("head.database.description")}
      />
      <Outlet />
    </div>
  );
};

export default Database;
