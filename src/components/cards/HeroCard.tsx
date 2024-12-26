import hero from "@/assets/sign-up/carousel.png";

const FeatureCard: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full m-0 p-0">
      <div className="h-full ">
        <img src={hero} alt="Carousel" className="" />
      </div>
    </div>
  );
};

export default FeatureCard;
