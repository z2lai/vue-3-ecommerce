const { assign, createMachine } = XState;

const setIsCoOwnerOptions = {
  SET_IS_CO_OWNER_TRUE: {
    actions: assign({ isCoOwner: (context, event) => event.target.value }),
  },
  SET_IS_CO_OWNER_FALSE: {
    actions: assign({ isCoOwner: (context, event) => event.target.value }),
  },
};

const selectingRepTypeForPersonOptions = {
  // for each of these transitions, create action to clear all inputs unrelated
  // to the selection while leaving the data for related inputs
  SELECT_LAWYER: ".lawyer",
  SELECT_FRIEND: ".friend",
  SELECT_FAMILY_MEMBER: ".familyMember",
  SELECT_INTERPRETER: ".interpreter",
};

const selectingRepTypeForLegalEntityOptions = {
  SELECT_IN_HOUSE_LEGAL_SERVICES: ".inHouseLegalServices",
  SELECT_LAWYER: ".lawyer",
  SELECT_INTERPRETER: ".interpreter",
  SELECT_EMPLOYEE_FOR_NFP: ".employeeForNFPClinic",
};

const selectingRepTypeForCondoCorpOptions = {
  SELECT_LAWYER: ".lawyer",
  SELECT_INTERPRETER: ".interpreter",
  SELECT_EMPLOYEE_FOR_NFP: ".employeeForNFP",
  SELECT_EMPLOYEE_OF_LEGAL_CLINIC: ".employeeOfLegalClinic",
};

const wizardMachine = createMachine({
  id: "wizard",
  initial: "section1Expanded",
  context: {
    isValid: false,
    yourRole: "",
    applicantType: "",
    isCoOwner: undefined,
  },
  states: {
    section1Expanded: {
      meta: {
        title: "About You and the Applicant",
      },
      initial: "subsection1Shown",
      states: {
        subsection1Shown: {
          meta: {
            title: "About You",
          },
          on: {
            SELECT_APPLICANT_ROLE: {
              actions: assign({
                yourRole: (context, event) => "applicant",
                applicantType: (context, event) => "condo owner",
              }),
            },
            SELECT_REPRESENTATIVE_ROLE: {
              actions: assign({
                yourRole: (context, event) => "representative",
                applicantType: (context, event) => "",
              }),
            },
            CONTINUE: {
              cond: (context) => context.yourRole !== "",
              target: "subsection2Shown",
            },
          },
        },
        subsection2Shown: {
          meta: {
            title: "About Applicant",
          },
          initial: "default",
          states: {
            default: {
              always: [
                {
                  cond: (context) => context.yourRole === "applicant",
                  target: "youAreTheApplicant",
                },
                {
                  cond: (context) => context.yourRole === "representative",
                  target: "youAreTheRepresentative",
                },
              ],
            },
            youAreTheApplicant: {
              meta: {
                flow: 1,
              },
              on: setIsCoOwnerOptions,
            },
            youAreTheRepresentative: {
              initial: "selectingApplicantType",
              states: {
                selectingApplicantType: {},
                selectingRepTypeForPerson: {
                  meta: {
                    flow: 2,
                  },
                  initial: "default",
                  states: {
                    default: {},
                    lawyer: { on: setIsCoOwnerOptions },
                    friend: { on: setIsCoOwnerOptions },
                    familyMember: { on: setIsCoOwnerOptions },
                    interpreter: { on: setIsCoOwnerOptions },
                  },
                  on: selectingRepTypeForPersonOptions,
                },
                selectingRepTypeForLegalEntity: {
                  meta: {
                    flow: 3,
                  },
                  initial: "default",
                  states: {
                    default: {},
                    inHouseLegalServices: { on: setIsCoOwnerOptions },
                    lawyer: { on: setIsCoOwnerOptions },
                    interpreter: { on: setIsCoOwnerOptions },
                    employeeForNFPClinic: { on: setIsCoOwnerOptions },
                  },
                  on: selectingRepTypeForLegalEntityOptions,
                },
                selectingRepTypeForCondoCorp: {
                  initial: "default",
                  states: {
                    default: {},
                    lawyer: {},
                    interpreter: {},
                    employeeForNFP: {},
                    employeeOfLegalClinic: {},
                  },
                  on: selectingRepTypeForCondoCorpOptions,
                },
              },
              on: {
                SELECT_PERSON_TYPE: {
                  actions: assign({
                    applicantType: (context, event) => "Condo Owner Rep",
                  }),
                  target: ".selectingRepTypeForPerson",
                },
                SELECT_LEGAL_ENTITY_TYPE: {
                  actions: assign({
                    applicantType: (context, event) => "Legal Entity Rep",
                  }),
                  target: ".selectingRepTypeForLegalEntity",
                },
                SELECT_CONDO_CORP_TYPE: {
                  actions: assign({
                    applicantType: (context, event) => "Condo Corp Rep",
                  }),
                  target: ".selectingRepTypeForCondoCorp",
                },
              },
            },
          },
          on: {
            CONTINUE: [
              {
                cond: (context) =>
                  context.yourRole !== "" && context.isCoOwner === true,
                target: "subsection3Shown",
              },
              {
                cond: (context) =>
                  context.yourRole !== "" && context.isCoOwner === false,
                target: "section1Complete",
              },
            ],
          },
        },
        subsection3Shown: {
          on: {
            CONTINUE: "section1Complete",
          },
        },
        section1Complete: {
          type: "final",
        },
      },
      on: {},
    },
    section2Expanded: {},
  },
});
