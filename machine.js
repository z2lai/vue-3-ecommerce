const { assign, createMachine } = XState;

const selectingRepTypeforPersonOptions = {
  // for each of these transitions, create action to clear all inputs unrelated
  // to the selection while leaving the data for related inputs
  SELECT_LAWYER: ".lawyer",
  SELECT_FRIEND: ".friend",
  SELECT_FAMILY_MEMBER: ".familyMember",
  SELECT_INTERPRETER: ".interpreter",
};

const selectingRepTypeforLegalEntityOptions = {
  SELECT_IN_HOUSE_LEGAL_SERVICES: ".inHouseLegalServices",
  SELECT_LAWYER: ".lawyer",
  SELECT_INTERPRETER: ".interpreter",
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: ".employeeForNFPClinic",
};

const forCondoCorpOptions = {
  SELECT_LAWYER: ".lawyer",
  SELECT_INTERPRETER: ".interpreter",
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: ".employeeForNFPClinic",
  SELECT_EMPLOYEE_OF_LEGAL_CLINIC: ".employeeOfLegalClinic",
};

const wizardMachine = createMachine(
  {
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
            initial: "fillingInAboutYou",
            states: {
              fillingInAboutYou: {},
              subsection1Complete: {},
              subsection2shown: {
                meta: {
                  title: "About Applicant",
                },
                initial: "default",
                states: {
                  default: {
                    always: [
                      {
                        cond: (context) => context.yourRole === "applicant",
                        target: "fillingInYouAreTheApplicant",
                      },
                      {
                        cond: (context) => context.yourRole === "representative",
                        target: "fillingInYouAreTheRepresentative",
                      },
                    ],
                  },
                  fillingInYouAreTheApplicant: {
                    meta: {
                      flow: 1,
                    },
                    on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }},
                  },
                  fillingInYouAreTheRepresentative: {
                    meta: {
                      flow: [2,3,4,5],
                    },
                    initial: "selectingApplicantType",
                    states: {
                      selectingApplicantType: {},
                      selectingRepTypeforPerson: {
                        meta: {
                          flow: 2,
                        },
                        initial: "default",
                        states: {
                          default: {},
                          lawyer: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          friend: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          familyMember: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          interpreter: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                        },
                        on: selectingRepTypeforPersonOptions,
                      },
                      selectingRepTypeforLegalEntity: {
                        meta: {
                          flow: 3,
                        },
                        initial: "default",
                        states: {
                          default: {},
                          inHouseLegalServices: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          lawyer: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          interpreter: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                          employeeForNFPClinic: { on: { SET_IS_CO_OWNER: { actions: 'setIsCoOwner' }}},
                        },
                        on: selectingRepTypeforLegalEntityOptions,
                      },
                      selectingRepTypeforCondoCorp: {
                        meta: {
                          flow: [4, 5],
                        },
                        initial: "default",
                        states: {
                          default: {},
                          lawyer: {},
                          interpreter: {},
                          employeeForNFPClinic: {},
                          employeeOfLegalClinic: {},
                        },
                        on: forCondoCorpOptions,
                      }, 
                    },
                    on: {
                      SELECT_PERSON_APPLICANT_TYPE: {
                        actions: assign({
                          applicantType: (context, event) => "Condo Owner Rep",
                        }),
                        target: ".selectingRepTypeforPerson",
                      },
                      SELECT_LEGAL_ENTITY_APPLICANT_TYPE: {
                        actions: assign({
                          applicantType: (context, event) => "Legal Entity Rep",
                        }),
                        target: ".selectingRepTypeforLegalEntity",
                      },
                      SELECT_CONDO_CORP_APPLICANT_TYPE: {
                        actions: assign({
                          applicantType: (context, event) => "Condo Corp Rep",
                        }),
                        target: ".selectingRepTypeforCondoCorp",
                      },
                    },
                  },
                  subsection2Completed: {},
                  subsection3Shown: {
                    initial: "fillingInCoOwners",
                    states: {
                      fillingInCoOwners: {},
                      subsection3Completed: { type: "final"},
                    },
                    on: {
                      CONTINUE: "subsection3Completed",
                    },
                  },
                },
                on: {
                  CONTINUE: [ // multiple targets is bad practice
                    {
                      cond: (context) =>
                        context.yourRole !== "" && context.isCoOwner === true, // replace context.yourRole with validation trigger
                      target: "subsection3Shown",
                    },
                    {
                      cond: (context) =>
                        context.yourRole !== "" && context.isCoOwner === false,
                      target: "#section1Completed",
                    },
                  ],
                },
              },
            }
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
                target: "subsection2shown",
              },
            },
          },
          section1Completed: {
            type: "final",
          },
        },
        on: {},
      },
      section1Completed: { type: 'final' },
    },
  },
  {
    actions: {
      setIsCoOwner: assign({ isCoOwner: (context, event) => event.value }),
    },  
  }
);
