interface articleregisterValidationValues {
  title: string;
  content: string;
}

export function articleRegisterValidation({ title, content }: articleregisterValidationValues) {
  if (title !== "" && content !== "") {
    return false;
  } else {
    return true;
  }
}
