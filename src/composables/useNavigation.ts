import { IconName } from "@/components/Icon.vue";

export type Link = {
  url: string;
  label: string;
  icon?: IconName;
};

export const useNavigation = () => {
  const homeLinks: Link[] = [
    {
      url: "#gallery",
      label: "Galleria",
    },
    {
      url: "#services",
      label: "Servizi",
    },
    {
      url: "#book",
      label: "Prenota",
    },
  ];

  const authLinks: Link[] = [
    {
      url: "/",
      label: "Home",
    },
  ];

  return {
    homeLinks,
    authLinks,
  };
};
