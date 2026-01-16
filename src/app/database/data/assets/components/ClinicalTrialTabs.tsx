import AssetDetailTabs from "./AssetDetailTabs";
import ContactDetailMask from "@/components/Database/ContactDetailMask";

const TAB_CONFIG = [
  {
    title: "Study Overview",
    fields: [
      { label: "Brief Summary", key: "brief_summary" },
      { label: "Study Type", key: "study_type" },
      { label: "Treatment", key: "treatment" },
      { label: "Acronym", key: "acronym" },
    ],
  },
  {
    title: "Eligibility",
    fields: [
      { label: "Enrollment", key: "enrollment" },
      { label: "Hospital Numbers", key: "hospital_count" },
      { label: "Age", key: "age" },
      { label: "Sex", key: "sex" },
    ],
  },
  {
    title: "Study Design & Results",
    fields: [
      { label: "Participant Registration", key: "prospective_retrospective" },
      { label: "Study Design", key: "study_design" },
      { label: "Main Objective", key: "main_objective" },
      { label: "Primary Outcome Measures", key: "primary_outcome_measures" },
      { label: "Secondary Study Design", key: "secondary_study_design" },
      { label: "Secondary Objectives", key: "secondary_objectives" },
      {
        label: "Secondary Outcome Measures",
        key: "secondary_outcome_measures",
      },
      { label: "Inclusion Criteria", key: "inclusion_criteria" },
      { label: "Exclusion Criteria", key: "exclusion_criteria" },
      { label: "Ethics Approval", key: "ethics_approval" },
    ],
  },
  {
    title: "Progress Date",
    fields: [
      { label: "Study Start", key: "start_date" },
      { label: "Study Completion", key: "completion_date" },
      { label: "Primary Completion", key: "primary_completion_date" },
      { label: "First Post", key: "first_posted" },
      { label: "Last Update Post", key: "last_update_posted" },
      { label: "Register Date", key: "register_date" },
    ],
  },
  {
    title: "Contact Detail",
    fields: [
      { label: "Contact Organization", key: "contact_organization" },
      { label: "Funder", key: "funder" },
      { label: "Funding Body Type", key: "funding_body_type" },
      { label: "Contact Name", key: "contact_name" },
      { label: "Phone", key: "contact_phone" },
      { label: "Mobile", key: "contact_mobile" },
      { label: "Email", key: "contact_email" },
      { label: "Address", key: "contact_address" },
      { label: "Postcode", key: "contact_postcode" },
    ],
  },
];

export default function ClinicalTrialTabs({
  data,
  userdata,
}: {
  data: any;
  userdata?: any;
}) {
  return (
    <AssetDetailTabs
      data={data}
      userdata={userdata}
      tabConfig={TAB_CONFIG}
      renderLockOverlay={(tab, { userdata: user }) =>
        tab.title === "Contact Detail" && user?.subscriptionLevel !== "Pro" ? (
          <ContactDetailMask />
        ) : null
      }
    />
  );
}
