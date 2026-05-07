"use client";
import { useLanguage } from "@/i18n/context";

const NavMessage = () => {
  const { t } = useLanguage();
  return <span>{t.navbar.devMessage}</span>;
};

export default NavMessage;
