/* eslint-disable react/no-unescaped-entities */
import { useTranslation, Trans } from "react-i18next";

const Policy = ({ setShowPolicy }) => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed left-0 top-0 w-full h-screen bg-[#00000044] z-50"
      onClick={(e) => {
        setShowPolicy(false);
        e.stopPropagation();
      }}
      onScroll={(e) => e.stopPropagation()}
    >
      <div
        className="absolute xl:mt-10 mt-5 max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-10px  pr-4 py-4 flex "
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        <div className="w-[312px] md:w-[624px] xl:w-[775px] max-h-[80vh] overflow-auto text-left pl-4 md:pl-10 xl:pl-14">
          <h1 className="py-7.5 text-3xl font-medium">
            {t("signup.signup_page.Policy.title")}
          </h1>

          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.introduction")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            <Trans i18nKey="signup.signup_page.Policy.usage">
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.This Privacy
              Policy has been created with the help of the
              <a
                href="https://www.privacypolicies.com/privacy-policy-generator/"
                className="hover:text-main-color underline"
              >
                Privacy Policy Generator.
              </a>
            </Trans>
          </p>

          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.interpretationTitle")}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.interpretationSubTitleTitle")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.interpretationContent")}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.definitionsTitle")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.definitionsContent")}
          </p>
          <br />

          <ul className="space-y-1 list-disc ml-7 text-base text-left text-black">
            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.account">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Account
                </span>
                means a unique account created for You to access our Service or
                parts of our Service.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.affiliate">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Affiliate
                </span>
                means an entity that controls, is controlled by or is under
                common control with a party, where "control" means ownership of
                50% or more of the shares, equity interest or other securities
                entitled to vote for election of directors or other managing
                authority.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.company">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Company
                </span>
                (referred to as either "the Company", "We", "Us" or "Our" in
                this Agreement) refers to Geneonline, 11F-A, No. 303, Section 4,
                Zhongxiao E Rd, Da’an District, Taipei City.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.cookies">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Cookies
                </span>
                are small files that are placed on Your computer, mobile device
                or any other device by a website, containing the details of Your
                browsing history on that website among its many uses.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.country">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Country
                </span>
                means any device that can access the Service such as a computer,
                a cellphone or a digital tablet.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.device">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Device
                </span>
                means any device that can access the Service such as a computer,
                a cellphone or a digital tablet.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.personalData">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Personal Data
                </span>
                is any information that relates to an identified or identifiable
                individual.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.service">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Service
                </span>
                refers to the Website.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.serviceProvider">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Service Provider
                </span>
                means any natural or legal person who processes the data on
                behalf of the Company. It refers to third-party companies or
                individuals employed by the Company to facilitate the Service,
                to provide the Service on behalf of the Company, to perform
                services related to the Service or to assist the Company in
                analyzing how the Service is used.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.thirdPartySocialMediaService">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Third-party Social Media Service
                </span>
                refers to any website or any social network website through
                which a User can log in or create an account to use the Service.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.usageData">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Usage Data
                </span>
                refers to data collected automatically, either generated by the
                use of the Service or from the Service infrastructure itself
                (for example, the duration of a page visit).
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.website">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  Website
                </span>
                refers to BIODND, accessible from{" "}
                <a
                  className="hover:text-main-color underline"
                  href="https://www.biodnd.com/"
                >
                  https://www.biodnd.com/
                </a>
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.terms.you">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  You
                </span>
                means the individual accessing or using the Service, or the
                company, or other legal entity on behalf of which such
                individual is accessing or using the Service, as applicable.
              </Trans>
            </li>
          </ul>

          <br />
          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.collectingPersonalDataTitle")}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.typesOfDataCollectedTitle")}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t("signup.signup_page.Policy.personalDataTitle")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDescription")}
          </p>
          <br />
          <ul className="space-y-2.5 list-disc ml-7 text-base text-left text-black">
            <li>{t("signup.signup_page.Policy.personalDataList.email")}</li>
            <li>{t("signup.signup_page.Policy.personalDataList.name")}</li>
            <li>{t("signup.signup_page.Policy.personalDataList.phone")}</li>
            <li>{t("signup.signup_page.Policy.personalDataList.address")}</li>
            <li>{t("signup.signup_page.Policy.personalDataList.usageData")}</li>
          </ul>

          <br />
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t("signup.signup_page.Policy.personalDataList.address")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.usageData.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.usageData.details")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.usageData.details_2")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.usageData.details_3")}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t("signup.signup_page.Policy.thirdPartySocialMediaServices.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.thirdPartySocialMediaServices.description"
            )}
          </p>
          <br />

          <ul className="space-y-2.5 list-disc ml-7 text-base text-left text-black">
            <li>
              {t(
                "signup.signup_page.Policy.thirdPartySocialMediaServices.services.0"
              )}
            </li>
            <li>
              {t(
                "signup.signup_page.Policy.thirdPartySocialMediaServices.services.1"
              )}
            </li>
            <li>
              {t(
                "signup.signup_page.Policy.thirdPartySocialMediaServices.services.2"
              )}
            </li>
            <li>
              {t(
                "signup.signup_page.Policy.thirdPartySocialMediaServices.services.3"
              )}
            </li>
          </ul>

          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.thirdPartySocialMediaServices.additionalInfo"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.thirdPartySocialMediaServices.additionalInfo_2"
            )}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t("signup.signup_page.Policy.trackingAndCookies.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.trackingAndCookies.description")}
          </p>
          <br />

          <ul className="space-y-2.5 list-disc ml-7 text-base text-left text-black">
            <li>
              {t("signup.signup_page.Policy.trackingAndCookies.description_2")}
            </li>
            <li>
              {t("signup.signup_page.Policy.trackingAndCookies.description_3")}
            </li>
          </ul>
          <br />
          <Trans i18nKey="signup.signup_page.Policy.trackingAndCookies.cookiesTypes.persistent">
            <p className=" text-base text-left text-black">
              Cookies can be "Persistent" or "Session" Cookies. Persistent
              Cookies remain on Your personal computer or mobile device when You
              go offline, while Session Cookies are deleted as soon as You close
              Your web browser. Learn more about cookies on the{" "}
              <a
                href="https://www.privacypolicies.com/blog/privacy-policy-template/#Use_Of_Cookies_Log_Files_And_Tracking"
                className=" text-base font-medium text-left text-black hover:text-main-color underline"
              >
                Privacy Policies website{" "}
              </a>
              article.
            </p>
          </Trans>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.below"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.necessary.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.necessary.type"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.administered"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.necessary.description"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.policyAcceptance.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.policyAcceptance.type"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.administered"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.policyAcceptance.description"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.functionality.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.functionality.type"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.administered"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.functionality.description"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.trackingAndCookies.cookiesTypes.functionality.description_2"
            )}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.personalDataUse.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataUse.description")}
          </p>
          <br />

          <ul className="space-y-1 list-disc ml-7 text-base text-left text-black">
            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.serviceProvision">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  To provide and maintain our Service
                </span>
                , including to monitor the usage of our Service.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.accountManagement">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  To manage Your Account
                </span>
                : to manage Your registration as a user of the Service. The
                Personal Data You provide can give You access to different
                functionalities of the Service that are available to You as a
                registered user.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.contractPerformance">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  For the performance of a contract
                </span>
                : the development, compliance and undertaking of the purchase
                contract for the products, items or services You have purchased
                or of any other contract with Us through the Service.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.communication">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  To contact You
                </span>
                : To contact You by email, telephone calls, SMS, or other
                equivalent forms of electronic communication, such as a mobile
                application's push notifications regarding updates or
                informative communications related to the functionalities,
                products or contracted services, including the security updates,
                when necessary or reasonable for their implementation.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.marketing">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  To provide You
                </span>
                with news, special offers and general information about other
                goods, services and events which we offer that are similar to
                those that you have already purchased or enquired about unless
                You have opted not to receive such information.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.requestsManagement">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  To manage Your requests
                </span>
                : To attend and manage Your requests to Us.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.businessTransfers">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  For business transfers
                </span>
                : We may use Your information to evaluate or conduct a merger,
                divestiture, restructuring, reorganization, dissolution, or
                other sale or transfer of some or all of Our assets, whether as
                a going concern or as part of bankruptcy, liquidation, or
                similar proceeding, in which Personal Data held by Us about our
                Service users is among the assets transferred.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataUse.purposes.otherPurposes">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  For other purposes
                </span>
                : We may use Your information for other purposes, such as data
                analysis, identifying usage trends, determining the
                effectiveness of our promotional campaigns and to evaluate and
                improve our Service, products, services, marketing and your
                experience.
              </Trans>
            </li>
          </ul>

          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataSharing.description")}
          </p>
          <br />

          <ul className="space-y-1 list-disc ml-7 text-base text-left text-black">
            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.withServiceProviders">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  With Service Providers
                </span>
                : We may share Your personal information with Service Providers
                to monitor and analyze the use of our Service, to contact You.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.forBusinessTransfers">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  For business transfers
                </span>
                : We may share or transfer Your personal information in
                connection with, or during negotiations of, any merger, sale of
                Company assets, financing, or acquisition of all or a portion of
                Our business to another company.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.withAffiliates">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  With Affiliates
                </span>
                : We may share Your information with Our affiliates, in which
                case we will require those affiliates to honor this Privacy
                Policy. Affiliates include Our parent company and any other
                subsidiaries, joint venture partners or other companies that We
                control or that are under common control with Us.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.withBusinessPartners">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  With business partners
                </span>
                : We may share Your information with Our business partners to
                offer You certain products, services or promotions.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.withOtherUsers">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  With other users
                </span>
                : when You share personal information or otherwise interact in
                the public areas with other users, such information may be
                viewed by all users and may be publicly distributed outside. If
                You interact with other users or register through a Third-Party
                Social Media Service, Your contacts on the Third-Party Social
                Media Service may see Your name, profile, pictures and
                description of Your activity. Similarly, other users will be
                able to view descriptions of Your activity, communicate with You
                and view Your profile.
              </Trans>
            </li>

            <li>
              <Trans i18nKey="signup.signup_page.Policy.personalDataSharing.situations.withYourConsent">
                <span className="pr-2 text-base font-semibold italic text-left text-black">
                  With Your consent
                </span>
                : We may disclose Your personal information for any other
                purpose with Your consent.
              </Trans>
            </li>
          </ul>

          <br />

          <br />

          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.personalDataRetention.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataRetention.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataRetention.description_2")}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.personalDataTransfer.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataTransfer.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataTransfer.description_2")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataTransfer.description_3")}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.personalDataDeletion.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDeletion.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDeletion.description_2")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDeletion.description_3")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDeletion.description_4")}
          </p>
          <br />
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.personalDataDisclosure.title")}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t(
              "signup.signup_page.Policy.personalDataDisclosure.businessTransactions"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataDisclosure.description")}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t(
              "signup.signup_page.Policy.personalDataDisclosure.lawEnforcement"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.personalDataDisclosure.description_2"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t("signup.signup_page.Policy.personalDataOther.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.personalDataOther.description")}
          </p>
          <br />

          <ul className="space-y-2 list-disc ml-6 text-base text-left text-black">
            <li>{t("signup.signup_page.Policy.personalDataOther.list.0")}</li>
            <li>{t("signup.signup_page.Policy.personalDataOther.list.1")}</li>
            <li>{t("signup.signup_page.Policy.personalDataOther.list.2")}</li>
            <li>{t("signup.signup_page.Policy.personalDataOther.list.3")}</li>
            <li>{t("signup.signup_page.Policy.personalDataOther.list.4")}</li>
          </ul>

          <br />
          <br />
          <p className=" text-base font-semibold text-left text-black">
            {t("signup.signup_page.Policy.security.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.security.description")}
          </p>
          <br />
          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.childrensPrivacy.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.childrensPrivacy.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.childrensPrivacy.description_2")}
          </p>
          <br />
          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.childrensPrivacy.description_2")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.linksToOtherWebsites.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.linksToOtherWebsites.description_2")}
          </p>
          <br />
          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.policyChanges.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.policyChanges.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.policyChanges.description_2")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.policyChanges.description_3")}
          </p>
          <br />
          <br />
          <br />
          <p className=" text-xl font-bold text-left text-black">
            {t("signup.signup_page.Policy.contactUs.title")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.contactUs.description")}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.contactUs.email")}
          </p>
          <br />
          <br />
          <br />
          <br />
          <p className=" text-3xl font-medium text-left text-black">
            {t("signup.signup_page.Policy.cookiesPolicy.title")}
          </p>
          <br />
          <br />
          <p className=" text-xl font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whatAreCookies.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whatAreCookies.content"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.usage.content"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t("signup.signup_page.Policy.cookiesPolicy.sections.explains")}
          </p>
          <br />
          <br />
          <p className=" text-xl font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whereWeUse.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whereWeUse.content"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whereWeUse.content_2"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.whereWeUse.content_3"
            )}
          </p>
          <br />
          <br />
          <p className=" text-xl font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.title"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.necessaryCookies.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.necessaryCookies.content"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.functionalityCookies.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.functionalityCookies.content"
            )}
          </p>
          <br />
          <p className=" text-base font-semibold italic text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.analyticalCookies.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.typesOfCookies.analyticalCookies.content"
            )}
          </p>
          <br />
          <br />
          <p className=" text-xl font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.howToDelete.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.howToDelete.content"
            )}
          </p>
          <br />
          <br />
          <p className=" text-xl font-semibold text-left text-black">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.contactUs.title"
            )}
          </p>
          <br />
          <p className=" text-base text-left text-black pb-10">
            {t(
              "signup.signup_page.Policy.cookiesPolicy.sections.contactUs.content"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
