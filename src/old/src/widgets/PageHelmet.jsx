import { Helmet, HelmetProvider } from "react-helmet-async";
const PageHelmet = ({ pageTitle, pageDescription }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={pageDescription}
          data-testid="metaDescription"
        />
      </Helmet>
    </HelmetProvider>
  );
};

export default PageHelmet;
