import CarouselSVG from "../../assets/carousel.svg";

const FeatureCard: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full m-0 p-0">
      <div className="w-full h-full max-w-[900px] max-h-[1069px] overflow-hidden">
        <img src={CarouselSVG} alt="Carousel" className="" />
      </div>
    </div>
  );
};

export default FeatureCard;
