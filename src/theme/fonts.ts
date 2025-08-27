type FontStyle = {
  fontFamily: string;
  fontWeight:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "normal"
    | "bold";
};

export type CustomFonts = {
  regular: FontStyle;
  medium: FontStyle;
  light: FontStyle;
  thin: FontStyle;
  bold: FontStyle;
  heavy: FontStyle;
};

export const customFonts : CustomFonts = {
  regular: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  light: {
    fontFamily: 'Poppins-Light',
    fontWeight: '300',
  },
  thin: {
    fontFamily: 'Poppins-Thin',
    fontWeight: '200',
  },
  bold: {
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },
  heavy: {
    fontFamily: "Poppins-Black", 
    fontWeight: "800",
  },
};
