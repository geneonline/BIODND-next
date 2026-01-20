import AssetDetailTabs from "./AssetDetailTabs";

const renderLink = (value) =>
  value ? (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="text-primary-default underline break-all"
    >
      {value}
    </a>
  ) : (
    "-"
  );

const DRUG_TAB_CONFIG = [
  {
    title: "Type & Use",
    fields: [
      { label: "Brief Summary", keys: ["brief_summary"] },
      { label: "Drug Class", keys: ["drug_class"] },
      { label: "Drug Category", keys: ["drug_category"] },
      { label: "Treatment", keys: ["treatment"] },
    ],
  },
  {
    title: "Ingredients & Form",
    fields: [
      {
        label: "Dosage Form",
        keys: ["dosage_form"],
      },
      {
        label: "Route / Spec",
        keys: ["route"],
      },
      {
        label: "Active Ingredients",
        keys: ["active_ingredients", "Name", "Strength"],
        showObjectKeys: false,
      },
      { label: "Substance Name", keys: ["substance_name"] },
      { label: "Package Spec.", keys: ["package_specification"] },
    ],
  },
  {
    title: "Review & Submissions",
    fields: [
      {
        label: "Application ID",
        keys: ["application_id"],
      },
      {
        label: "Submission Type",
        keys: ["submission_type"],
      },
      {
        label: "Application Type",
        keys: ["application_type"],
      },
      {
        label: "Product NDC",
        keys: ["product_ndc"],
      },
      { label: "Package NDC", keys: ["product_ndc"] },
      {
        label: "Reference Drug",
        keys: ["reference_drug"],
      },
      {
        label: "Reference Standard",
        keys: ["reference_standard"],
        // render: renderLink,
      },
      {
        label: "TE Code",
        keys: ["te_code"],
      },
      {
        label: "RxCUI",
        keys: ["rxcui"],
      },
      {
        label: "UNII",
        keys: ["unii"],
      },
      {
        label: "SPL ID",
        keys: ["spl_id"],
      },
      {
        label: "SPL SET ID",
        keys: ["spl_set_id"],
      },
      {
        label: "Pharm Class EPC",
        keys: ["pharm_class_epc"],
      },
      {
        label: "Pharm Class MOA",
        keys: ["pharm_class_moa"],
      },
      {
        label: "Submission Number",
        keys: ["submission_number"],
      },
      {
        label: "Submission Status",
        keys: ["submission_status"],
      },
      {
        label: "Submission Class Code",
        keys: ["submission_class_code"],
      },
      {
        label: "Submission Class Code Description",
        keys: ["submission_class_code_description"],
      },
      {
        label: "Application Docs",
        keys: ["application_url"],
      },
      {
        label: "Additional Monitoring",
        keys: ["additional_monitoring"],
      },
      {
        label: "Generic",
        keys: ["generic"],
      },
      {
        label: "Biosimilar",
        keys: ["biosimilar"],
      },
      {
        label: "Conditional Approval",
        keys: ["conditional_approval"],
      },
      {
        label: "Accelerated Assessment",
        keys: ["accelerated_assessment"],
      },
      {
        label: "Orphan Medicine",
        keys: ["orphan_medicine"],
      },
      {
        label: "Advanced Therapy",
        keys: ["advanced_therapy"],
      },
      {
        label: "Prime Medicine",
        keys: ["prime_medicine"],
      },
    ],
  },
  {
    title: "Progress Date",
    fields: [
      { label: "Submission Status Date", keys: ["submission_status_date"] },
      { label: "Opinion Date", keys: ["opinion_date"] },
      {
        label: "Authorization Date",
        keys: ["application_date"],
      },
      { label: "First Published", keys: ["first_published"] },
      {
        label: "Last Update Date",
        keys: ["last_update_date"],
      },
      {
        label: "Commission Decision Date",
        keys: ["commission_decision_date"],
      },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      {
        label: "License Holder",
        keys: ["organization"],
      },
      {
        label: "License Holder Address",
        keys: ["license_holder_address"],
      },
      { label: "License Type", keys: ["license_type"] },
      { label: "Manufacturing", keys: ["manufacturing"] },
      { label: "Manufacturing Address", keys: ["manufacturing_address"] },
    ],
  },
];

const DrugDetailTabs = ({ data }) => (
  <AssetDetailTabs data={data} tabConfig={DRUG_TAB_CONFIG} />
);

export default DrugDetailTabs;
