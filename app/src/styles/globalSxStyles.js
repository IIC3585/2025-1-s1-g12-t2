import { useTheme } from "@mui/material/styles";

export function useSxStyles() {
  const theme = useTheme();
  const hoverColor = "#5863cc";

  return {
    fwidth: {
      width: "100%",
    },
    largeButton: {
      borderRadius: 4,
      flex: 1,
      backgroundColor: theme.palette.primary.highlight,
      color: theme.palette.primary.highlightText,
      fontWeight: "bold",
    },
    welcomeText: {
      opacity: 0.6,
      mt: 4,
      textAlign: "center",
    },
    largeButtonsContainer: {
      display: "flex",
      gap: 2,
      mt: 2,
    },
    mediaContainer: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 2,
      justifyContent: "center",
      alignItems: "stretch",
    },
    iconSize: {
      fontSize: 32,
    },
    infoButton: {
      borderRadius: "50%",
      boxShadow: 4,
      background: `linear-gradient(135deg, ${theme.palette.primary.info} 60%, ${theme.palette.secondary.main} 100%)`,
      color: theme.palette.primary.highlightText,
      width: 40,
      height: 40,
      transition: "box-shadow 0.3s, filter 0.3s",
      filter: "drop-shadow(0 0 8px #fff8) brightness(1)",
      "&:hover": {
        background: `linear-gradient(135deg, ${theme.palette.secondary.info} 60%, ${theme.palette.primary.main} 100%)`,
      },
    },
    galleryButton: {
      borderRadius: 4,
      backgroundColor: theme.palette.primary.highlight,
      color: theme.palette.primary.highlightText,
      fontWeight: "bold",
    },
    galleryButtonContainer: {
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    },
    mainHeaderContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
    mainContainer: {
      px: { xs: 2, sm: 2, md: 15, lg: 15 },
      minHeight: "100vh",
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    filterButton: {
      width: "100%",
      backgroundColor: theme.palette.primary.main,
      fontWeight: "bold",
      borderRadius: 4,
    },
    filtersBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      borderRadius: 4,
      gap: 1.5,
      margin: 2,
    },
    menuBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "top",
      width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
      maxWidth: 400,
      border: "2px solid",
      borderColor: "#ccc",
      borderRadius: 4,
      padding: { xs: 2, sm: 3, md: 3 },
      boxSizing: "border-box",
      margin: "0 auto",
    },
    mediaBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: { xs: "100%", sm: "100%", md: "100%", lg: "200%" },
      height: 500,
      border: "2px dashed",
      borderColor: "#ccc",
      borderRadius: 4,
      backgroundColor: "#f5f5f5",
      color: "#cccccc",
      "&:hover": {
        borderColor: hoverColor,
        cursor: "pointer",
      },
      "&:hover .child": {
        color: hoverColor,
      },
    },
    imageBox: {
      objectFit: "contain",
      maxHeight: "90%",
      maxWidth: "90%",
    },
    mainGalleryContainer: {
      px: { xs: 2, sm: 2, md: 15, lg: 15 },
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      py: 4,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    buttonGalleryContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    },
    galleryButton: {
      backgroundColor: theme.palette.primary.highlight,
      color: theme.palette.primary.highlightText,
    },
  };
}
