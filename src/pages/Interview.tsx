import React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CheckSetup from "./CheckSetup";
import axios from "axios";
import Interview from "@/components/Interview/Interview";

const InterviewPage = () => {
  const { id } = useParams();
  const [isSetupComplete, setIsSetupComplete] = React.useState(true);
  const navigate = useNavigate();

  const generateInterview = () => {
    axios.get("http://localhost:3000/interview/generate").then((response) => {
      let interviewId = response.data.interview._id;
      navigate(`/interview/${interviewId}`);
    });
  };
  useEffect(() => {
    if (!id) {
      generateInterview();
    }
  }, [id]);

  return !isSetupComplete ? <CheckSetup /> : <Interview />;
};

export default InterviewPage;