import loadingImg from "@/assets/img/loading.png";

const Loading = ({ height = "80vh" }) => {
  return (
    <div className={`w-full h-[${height}] flex justify-center items-center`}>
      <img className=" animate-spin" src={loadingImg} alt="" />
    </div>
  );
};

export default Loading;
