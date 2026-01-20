import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAssetProfile } from "@/data/api";

import Description_content from "@/widgets/database/Description_content";
import { tableStyle } from "@/data/tailwindStyleGroup";

const AssetsProfile = () => {
  const { t } = useTranslation();
  let { id } = useParams();

  const { assetsData } = useAssetProfile(id);

  const [servicesAssets, setServicesAssets] = useState([]);
  const [technologiesAssets, setTechnologiesAssets] = useState([]);
  const [productsAssets, setProductsAssets] = useState([]);

  // filter service assets and technologies assets, other will be products
  useEffect(() => {
    if (assetsData && assetsData.assets) {
      const servicesTypes = [
        "Biotechnology / R&D Services",
        "Molecular diagnostics",
        "Other diagnostic",
        "Professional Services and Consulting",
        "Services",
        "Supplier & Engineering",
      ];
      const technologiesTypes = [
        "Technologies",
        "Clinical Development Tools",
        "Discovery Tools",
        "Drug delivery/formulation technology",
      ];

      const newServicesAssets = assetsData.assets.filter((asset) =>
        servicesTypes.includes(asset.assets_types)
      );
      const newTechnologiesAssets = assetsData.assets.filter((asset) =>
        technologiesTypes.includes(asset.assets_types)
      );
      const newProductsAssets = assetsData.assets.filter(
        (asset) =>
          !servicesTypes.includes(asset.assets_types) &&
          !technologiesTypes.includes(asset.assets_types)
      );

      setServicesAssets(newServicesAssets);
      setTechnologiesAssets(newTechnologiesAssets);
      setProductsAssets(newProductsAssets);
    }
  }, [assetsData]);

  return (
    <div className="mx-10">
      {/* Products */}
      {productsAssets.length > 0 && (
        <>
          <h2 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15">
            {t("company_profile.assets.title.Products")}
          </h2>
          <table className="mr-3 border-separate border-spacing-0">
            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal ">
              <tr>
                <th className={tableStyle.th}>
                  {t("company_profile.assets.table_headers.product_name")}
                </th>
                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.main_therapeutic_area"
                  )}
                </th>
                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.product_description"
                  )}
                </th>
                <th className={tableStyle.th}>
                  {t("company_profile.assets.table_headers.development_phase")}
                </th>
                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.administration_mode"
                  )}
                </th>
                {/* <th className={tableStyle.th}>IP Rights</th> */}
              </tr>
            </thead>
            <tbody className="text-xs3">
              {productsAssets.map((asset) => (
                <tr className="border border-footer-text" key={asset.id}>
                  <td className={`max-w-[350px] text-sm ${tableStyle.td}`}>
                    <p>{asset.product_name}</p>
                  </td>

                  {/* main_therapeutic_sector */}
                  <td className={`max-w-[300px]  ${tableStyle.td}`}>
                    {asset.main_therapeutic_sector ? (
                      <div className="flex flex-wrap">
                        {asset.main_therapeutic_sector
                          .split("|")
                          .map((i, index) => (
                            <p
                              key={index}
                              className="px-2.5 py-1.5 m-1 text-sm text-db-table-text bg-bd-gray rounded-20px"
                            >
                              {i}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center">N/A</p>
                    )}
                  </td>

                  <td className={`max-w-[400px] ${tableStyle.td}`}>
                    <Description_content
                      content={asset.product_description || "empty"}
                      maxCharacters={200}
                      width={170}
                      companyName={asset.product_name}
                      haveImg={false}
                    />
                  </td>

                  <td className={`${tableStyle.td}`}>
                    <p className="text-center">
                      {asset.development_phase || "N/A"}
                    </p>
                  </td>

                  <td className={`max-w-[300px] ${tableStyle.td}`}>
                    {asset.mode_of_administration ? (
                      <div className="flex flex-wrap ">
                        {asset.mode_of_administration
                          .split("\n")
                          .map((i, index) => (
                            <p
                              key={index}
                              className="px-2.5 py-1.5 m-1 text-sm text-db-table-text bg-bd-gray rounded-10px"
                            >
                              {i}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center">N/A</p>
                    )}
                  </td>

                  {/* <td className="max-w-[500px]">
                          <p className="text-center p-2">
                            {asset.ip_rights || "N/A"}
                          </p>
                        </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Services */}
      {servicesAssets.length > 0 && (
        <>
          <h2 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15">
            {t("company_profile.assets.title.Services")}
          </h2>
          <table className="mr-3 border-separate border-spacing-0">
            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal">
              <tr>
                <th className={tableStyle.th}>
                  {t("company_profile.assets.table_headers.service_name")}
                </th>

                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.service_description"
                  )}
                </th>

                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.service_availability"
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="text-xs3">
              {servicesAssets.map((asset) => (
                <tr className="border border-footer-text" key={asset.id}>
                  <td className={`max-w-[350px] text-sm ${tableStyle.td}`}>
                    <p>{asset.product_name}</p>
                  </td>

                  <td className={`max-w-[400px] ${tableStyle.td}`}>
                    <Description_content
                      content={asset.product_description || "empty"}
                      maxCharacters={200}
                      width={170}
                      companyName={asset.product_name}
                      haveImg={false}
                    />
                  </td>

                  <td className={`text-center ${tableStyle.td}`}>
                    <p>{asset.service_availability || "N/A"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Technologies */}
      {technologiesAssets.length > 0 && (
        <>
          <h2 className="text-xl font-medium text-profile-asset-title  pl-2.5 mr-3 mb-4 mt-15">
            {t("company_profile.assets.title.Technologies")}
          </h2>
          <table className="mr-3 border-separate border-spacing-0">
            <thead className="text-xs3 text-main-text-gray bg-profile-viewed-bg font-normal">
              <tr>
                <th className={tableStyle.th}>
                  {" "}
                  {t("company_profile.assets.table_headers.technologies_name")}
                </th>

                <th className={tableStyle.th}>
                  {t(
                    "company_profile.assets.table_headers.technologies_description"
                  )}
                </th>
                {/* <th className={tableStyle.th}>IP Rights</th> */}
              </tr>
            </thead>
            <tbody className="text-xs3">
              {technologiesAssets.map((asset) => (
                <tr className="border border-footer-text" key={asset.id}>
                  <td className={`max-w-[350px] text-sm ${tableStyle.td}`}>
                    <p>{asset.product_name}</p>
                  </td>

                  <td className={`max-w-[400px] ${tableStyle.td}`}>
                    <Description_content
                      content={asset.product_description || "empty"}
                      maxCharacters={200}
                      width={170}
                      companyName={asset.product_name}
                      haveImg={false}
                    />
                  </td>

                  {/* <td className="tetxt-center p-2">
                          <p>{asset.ip_rights || "N/A"}</p>
                        </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!productsAssets.length &&
        !servicesAssets.length &&
        !technologiesAssets.length && (
          <h2 className="text-xl font-medium text-profile-asset-title  mx-3 my-40 text-center">
            this company has no assets.
          </h2>
        )}
    </div>
  );
};

export default AssetsProfile;
