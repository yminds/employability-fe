export const parsedTransformData = async (
  data: any,
  skillsData: any
) => {

  const transformDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr === "Present") return null;

    try {
      const parts = dateStr.replace(",", "").trim().split(" ");
      if (parts.length !== 2) {
        return "";
      }

      const [monthStr, yearStr] = parts;
      const monthNames: { [key: string]: string } = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
      };

      const month = monthNames[monthStr];
      if (!month) {
        console.error("Invalid month:", monthStr);
        return "";
      }

      return `${yearStr}-${month}`;
    } catch (error) {
      console.error("Error parsing date:", dateStr);
      return "";
    }
  };


  return {
    skills:
      skillsData.map((skill: any) => ({
        skill_Id: skill._id || "",
        name: skill.name || "",
        rating: 0,
        level: "1",
        visibility: "All users",
      })) || [],
    experience:
      data.experience?.map((exp: any) => {
        const startDate = transformDate(exp.startDate);
        const endDate =
          exp.endDate === "Present" ? null : transformDate(exp.endDate);
        return {
          title: exp.jobTitle || "",
          employment_type: "",
          company: exp.company || "",
          location: exp.location || "",
          start_date: startDate,
          end_date: endDate,
          currently_working: exp.endDate === "Present",
          description: exp.responsibilities?.join("\n") || "",
          current_ctc: "",
          expected_ctc: "",
          companyLogo: "",
          isVerified: undefined,
        };
      }) || [],
    education:
      data.education?.map((edu: any) => ({
        education_level: "",
        degree: edu.degree || "",
        institute: edu.institution || "",
        board_or_certification: "",
        from_date: "",
        till_date: "",
        cgpa_or_marks: "",
      })) || [],
    certifications:
      data.certifications?.map((cert: any) => ({
        title: cert.name || "",
        issued_by: cert.issuer || "",
        issue_date: transformDate(cert.dateObtained) || "",
        expiration_date: transformDate(cert.expiryDate) || "",
        certificate_s3_url: "",
      })) || [],
  };
};
