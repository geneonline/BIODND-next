import AssetDetailTabs from "./AssetDetailTabs";

const DEVICE_TAB_CONFIG = [
  {
    title: "Type & Use",
    fields: [
      {
        label: "Medical Specialty",
        keys: ["medical_specialty"],
        showObjectKeys: false,
      },
      { label: "Advisory & Review", keys: ["advisory_review"] },
    ],
  },
  {
    title: "Approval",
    fields: [
      {
        label: "Clearance Type",
        keys: ["clearance_type"],
      },
      {
        label: "Applicant ID",
        keys: ["applicant_id"],
      },
      {
        label: "License Type",
        keys: ["license_type_en"],
      },
      {
        label: "Third Party Flag",
        keys: ["third_party_flag"],
      },
      { label: "Apply Code", keys: ["code"] },
      {
        label: "Description",
        keys: ["description"],
      },
      {
        label: "Cancellation Reason",
        keys: ["cancellation_reason_en"],
      },
    ],
  },
  {
    title: "Timeline",
    fields: [
      {
        label: "Approval Date",
        keys: ["approval_date"],
      },
      {
        label: "Completion Date",
        keys: ["decision date"],
      },
      {
        label: "Update Date",
        keys: ["modification_date"],
      },
      { label: "Expiry Date", keys: ["expiry_date"] },
      { label: "Cancellation Date", keys: ["cancellation_date"] },
      {
        label: "Collect Time",
        keys: ["collect_time"],
      },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      { label: "Contact Company", keys: ["organization"] },
      { label: "Contact Name", keys: ["contact_name"] },
      { label: "Contact Address", keys: ["contact_address"] },
      { label: "Manufacturing", keys: ["manufacturing"] },
      {
        label: "Manufacturer Address",
        keys: ["manufacturer_address", "Manufacturer address"],
      },
      {
        label: "Manufacturer Country",
        keys: ["manufacturer_country"],
      },
    ],
  },
];

const DeviceDetailTabs = ({ data }: { data: any }) => (
  <AssetDetailTabs data={data} tabConfig={DEVICE_TAB_CONFIG} />
);

export default DeviceDetailTabs;
