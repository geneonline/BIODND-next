import job_title_icon from "@/assets/svg/trial_account_apply/job_title_icon.svg";
import profiles_icon from "@/assets/svg/trial_account_apply/profiles_icon.svg";
import mail_icon from "@/assets/svg/trial_account_apply/mail_icon.svg";
import company_icon from "@/assets/svg/trial_account_apply/company_icon.svg";
import phone_icon from "@/assets/svg/trial_account_apply/phone_icon.svg";

export const inputFields = [
  {
    id: "firstName",
    entryName: "entry.1797746638",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    icon: profiles_icon,
    required: true,
    value: "Lin",
  },
  {
    id: "lastName",
    entryName: "entry.1022022986",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    icon: profiles_icon,
    required: true,
  },
  {
    id: "jobtitle",
    entryName: "entry.1859418169",
    label: "Job Title",
    type: "text",
    placeholder: "Enter your Job Title",
    icon: job_title_icon,
    required: true,
  },
  {
    id: "email",
    entryName: "entry.1729519511",
    label: "Business Email",
    type: "email",
    placeholder: "Enter your email",
    icon: mail_icon,
    required: true,
    value: "sharon.lin@geneonlineas",
  },
  {
    id: "company",
    entryName: "entry.1668524869",
    label: "Company",
    type: "text",
    placeholder: "Enter your company",
    icon: company_icon,
    required: true,
  },
  {
    id: "phone",
    entryName: "entry.236941534",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    icon: phone_icon,
    // You can remove or adjust the preset value and error message as needed.
    value: "",
    error: "",
  },
];
