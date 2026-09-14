export const navigation = [
  ["Home", "home"], ["About", "about"], ["Services", "services"],
  ["Projects", "projects"], ["Plant & Machinery", "plant-workshops"], ["Compliance", "compliance"],
];

export function navigationHref(id: string, onAbout = false) {
  if (id === "about") return "/about";
  if (id === "services") return "/services";
  if (id === "projects") return "/projects";
  if (id === "plant-workshops") return "/plant-workshops";
  if (id === "compliance") return "/compliance";
  if (id === "home") return onAbout ? "/" : "#home";
  return `${onAbout ? "/" : ""}#${id}`;
}
