import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import getTutorCertificationsFromDB from "@/firebase/tutor/dashboard/certifications/getTutorCertificationsFromDB";
import { TutorCertificationsDataType } from "@/types";

const style = {
  color: "#08A935",
};

const Certifications = ({ uid }: { uid: string }) => {
  const [certifications, setCertifications] = useState<
    TutorCertificationsDataType[]
  >([]);

  useEffect(() => {
    const getCertifications = async () => {
      const response = await getTutorCertificationsFromDB({ uid });
      if (response.type === "success") {
        setCertifications(
          response.certifications as TutorCertificationsDataType[]
        );
      }
    };
    getCertifications();
  }, [uid]);

  return (
    <div className="mt-10">
      {certifications.length === 0 ? (
        <div className="custom-shadow px-8  py-10 rounded-xl my-3 bg-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#4A148C] mb-3">
              Certification
            </h2>
            <p className="text-gray-600">
              No Certification added by this mentor yet
            </p>
          </div>
        </div>
      ) : (
        certifications.map((certificate, index) => {
          return (
            <div
              key={index}
              className="custom-shadow px-6 py-4 rounded-xl my-3"
            >
              <div className="flex flex-row mx-10 items-center justify-between gap-3">
                <div>
                  <h1 className="font-semibold text-lg">
                    {certificate.certification_heading || "No description"}
                  </h1>
                  {certificate.is_verified && (
                    <div className="mt-4 flex flex-row items-center gap-3">
                      <div>
                        <FaCheck style={style} />
                      </div>
                      <div>
                        <h1 className="font-semibold text-lg text-[#08A935]">
                          Verified
                        </h1>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {certificate.image_url ? (
                    <Image
                      src={certificate.image_url}
                      alt="Certificate Image"
                      width={200}
                      height={100}
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Certifications;
