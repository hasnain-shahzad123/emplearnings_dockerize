import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useTutor } from "@/contexts/TutorContext";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
import addCountryToDB from "@/firebase/tutor/bio/add/addTutorCountryToDB";
import { useEffect, useState } from "react";
import { set } from "zod";
const CountryDetails = ({ tutorId }: { tutorId: string }) => {
  const { showAlert } = useAlert();
  const [isInputReadOnly, setIsInputReadOnly] = useState<boolean>(false);
  const countries = [
    "Select Country",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "The Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo, Democratic Republic of the",
    "Congo, Republic of the",
    "Costa Rica",
    "Côte d’Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor (Timor-Leste)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "The Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, North",
    "Korea, South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sudan, South",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];


  const [selectedCountry, setSelectedCountry] = useState<string>("Select Country");
  const [isDataLoading,setDataLoading] = useState<boolean>(true);
  const { tutor } = useTutor();

  const handleSave = async () => {

    console.log("form values are", selectedCountry);
    const response = await addCountryToDB({
      tutorId: tutorId,
      country: selectedCountry,
    });
    if ((response.type === "error")) {
      //alert(response.message);
      showAlert(response.message, "ERROR");
    } else {

      showAlert("Country updated successfully", "SUCCESS");
    }
    setIsInputReadOnly(false);
  };

 

  useEffect(() => {
    if (tutor) {
      setSelectedCountry(tutor.country)
    }
    setDataLoading(false);
  }, [tutor])

  // TODO: Fix the UI
  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="text-xl font-semibold mb-10">Country Details</h1>
      <div className="flex -z-10 flex-row justify-between items-center gap-10">
        {isDataLoading && <Spinner className="mx-10" size="sm" />}
        <div
          className={`${isDataLoading ? "hidden" : "block"} w-[50%] relative`}
        >
          <label
            className={`absolute p-1 bg-white inline ${
              !isInputReadOnly ? "-top-3" : "-top-3"
            } bg-white left-2 text-xs z-0`}
          >
            Country*
          </label>
          <select
            onClick={() => setIsInputReadOnly(true)}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
            }}
            value={selectedCountry}
            className={`w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 ${
              !isInputReadOnly ? "bg-gray-100" : ""
            }`}
          >
            {countries.map((country) => {
              return (
                <option key={country} value={country}>
                  {country}
                </option>
              );
            })}
          </select>
        </div>
        {/* <div>
          {tutor?.country}
        </div> */}
      </div>
      <div className="flex md:flex-row mx-5 flex-col-reverse md:justify-end">
        {isInputReadOnly ? (
          <>
            <CustomButton
              onclickEvent={() => {
                if (tutor) {
                  setSelectedCountry(tutor.country);
                }
                setIsInputReadOnly(false)
              }}
              text={"Cancel"}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
            <CustomButton
              onclickEvent={() => handleSave()}
              text={"Save"}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CountryDetails;
