const Elastic_Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-profile-button-bg bg-opacity-60 z-50 flex items-center justify-center">
      <div className="flex justify-between w-[135px] h-[50px]">
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce1"></div>
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce2"></div>
        <div className="w-7 h-7 bg-img-border rounded-full animate-bounce3"></div>
      </div>
    </div>
  );
};
export default Elastic_Loading;
