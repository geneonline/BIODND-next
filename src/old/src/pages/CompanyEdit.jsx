import { useState, useEffect } from "react";
import axios from "axios";

import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsEdit } from "../store/companyProfileSlice";
const CompanyEdit = () => {
  const [inputData, setInputData] = useState({});
  const dispatch = useDispatch();
  const info = useSelector((state) => state.companyProfile.info);
  const { id } = useParams();

  useEffect(() => {
    dispatch(setIsEdit(true));
    console.log(info);
  }, [dispatch, info]);

  const onblurHandler = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const formData = new FormData();
  formData.append("_method", "patch");
  formData.append("company[State]", "12345");

  const submitHandler = (e) => {
    e.preventDefault();

    const url = `/companies/${id}`;
    axios
      .post(url, formData)
      .then((response) => {
        // 處理成功的回應
        console.log(response.data);
      })
      .catch((error) => {
        // 處理錯誤的回應
        console.error(error);
      });
  };
  return (
    <div>
      <h1>CompanyEdit</h1>
      <h2>ID:{id}</h2>
      <form className="flex flex-col" onSubmit={submitHandler}>
        <label className="p-1 m-1" htmlFor="Company_Logo">
          Company Logo:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Company_Logo"
          name="Company_Logo"
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Company_Name">
          Company Name:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Company_Name"
          name="Company_Name"
          defaultValue={info.Company_Name}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Brief_Description">
          Brief description:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Brief_Description"
          name="Brief_Description"
          defaultValue={info.Brief_Description}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Country">
          Country:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Country"
          name="Country"
          defaultValue={info.Country}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="State">
          State:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="State"
          name="State"
          defaultValue={info.State}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="City">
          City:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="City"
          name="City"
          defaultValue={info.City}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Address">
          Address:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Address"
          name="Address"
          defaultValue={info.Address}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Postal_Code">
          Postal Code:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Postal_Code"
          name="Postal_Code"
          defaultValue={info.Postal_Code}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Phone">
          Phone:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Phone"
          name="Phone"
          defaultValue={info.Phone}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Email">
          Email:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Email"
          name="Email"
          defaultValue={info.Email}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Website">
          Website:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Website"
          name="Website"
          defaultValue={info.Website}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Company_Status">
          Company Status:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Company_Status"
          name="Company_Status"
          defaultValue={info.Company_Status}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Company_Types">
          Company Types:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Company Types"
          name="Company Types"
          defaultValue={info.Company_Types}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Description">
          Description:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Description"
          name="Description"
          defaultValue={info.Description}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="News">
          News:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="News"
          name="News"
          defaultValue={info.News}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Primary_Therapeutic_Areas">
          Primary Therapeutic Areas:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Primary_Therapeutic_Areas"
          name="Primary_Therapeutic_Areas"
          defaultValue={info.Primary_Therapeutic_Areas}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Secondary_Therapeutic_Areas">
          Secondary Therapeutic Areas:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Secondary_Therapeutic_Areas"
          name="Secondary_Therapeutic_Areas"
          defaultValue={info.Secondary_Therapeutic_Areas}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Number_Of_Employees">
          Number Of Employees:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Number_Of_Employees"
          name="Number_Of_Employees"
          defaultValue={info.Number_Of_Employees}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Founded">
          Founded:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Founded"
          name="Founded"
          defaultValue={info.Founded}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Ownership">
          Ownership:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Ownership"
          name="Ownership"
          defaultValue={info.Ownership}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Licensing_Objectives">
          Licensing Objectives:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Licensing_Objectives"
          name="Licensing_Objectives"
          defaultValue={info.Licensing_Objectives}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Company_Objectives">
          Company Objectives:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Company_Objectives"
          name="Company_Objectives"
          defaultValue={info.Company_Objectives}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Ticker">
          Ticker:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Ticker"
          name="Ticker"
          defaultValue={info.Ticker}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Market_Cap_M">
          Market Cap M:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Market_Cap_M"
          name="Market_Cap_M"
          defaultValue={info.Market_Cap_M}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Last_Funding_Round">
          Last Funding Round:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Last_Funding_Round"
          name="Last_Funding_Round"
          defaultValue={info.Last_Funding_Round}
          onBlur={onblurHandler}
        />
        <label className="p-1 m-1" htmlFor="Total_Funding_M">
          Total Funding M:
        </label>
        <input
          className="p-1 m-1"
          type="text"
          id="Total_Funding_M"
          name="Total_Funding_M"
          defaultValue={info.Total_Funding_M}
          onBlur={onblurHandler}
        />
        <button className="p-1 border-1 border-main-blue" type="submit">
          Update company
        </button>
      </form>
      <Link
        to={`/database/${info.id}`}
        onClick={() => dispatch(setIsEdit(false))}
      >
        compapy profile
      </Link>
      <Link to="/database/search" onClick={() => dispatch(setIsEdit(false))}>
        back
      </Link>
    </div>
  );
};

export default CompanyEdit;
