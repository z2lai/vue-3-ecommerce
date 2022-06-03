const { assign, createMachine } = XState;

const setIsCoOwnerEvents = {
  SET_IS_CO_OWNER_TRUE: [
    {
      cond: (context) => context.subsection2Completed,
      actions: assign({ isCoOwner: (context, event) => true }),
      target: ".showingSubsection3",
    },
    { actions: assign({ isCoOwner: (context, event) => true }) },
  ],
  SET_IS_CO_OWNER_FALSE: [
    {
      cond: (context) => context.subsection2Completed,
      actions: assign({ isCoOwner: (context, event) => false }),
      target: ".showingSubsection3",
    },
    { actions: assign({ isCoOwner: (context, event) => false }) },
  ],
};

const selectingRepTypeForPersonEvents = {
  // for each of these transitions, create action to clear all inputs unrelated
  // to the selection while leaving the data for related inputs
  SELECT_LAWYER: {
    cond: (context) => context.repType !== "Lawyer",
    target: ".repTypeForPersonSelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_FRIEND: {
    cond: (context) => context.repType !== "Friend",
    target: ".repTypeForPersonSelected",
    actions: "assignRepTypeFriend",
  },
  SELECT_FAMILY_MEMBER: {
    cond: (context) => context.repType !== "Family Member",
    target: ".repTypeForPersonSelected",
    actions: "assignRepTypeFamilyMember",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".repTypeForPersonSelected",
    actions: "assignRepTypeInterpreter",
  },
};

const selectingRepTypeForLegalEntityEvents = {
  SELECT_IN_HOUSE_LEGAL_SERVICES_PROVIDER: {
    cond: (context) => context.repType !== "In-House Legal Services Provider",
    target: ".repTypeForLegalEntitySelected",
    actions: "assignRepTypeInHouseLegalServicesProvider",
  },
  SELECT_LAWYER: {
    cond: (context) => context.repType !== "Lawyer",
    target: ".repTypeForLegalEntitySelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".repTypeForLegalEntitySelected",
    actions: "assignRepTypeInterpreter",
  },
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: {
    cond: (context) => context.repType !== "Employee for Not-for-Profit Clinic",
    target: ".repTypeForLegalEntitySelected",
    actions: "assignRepTypeEmployeeForNFPClinic",
  },
};

const selectingRepTypeForCondoCorpEvents = {
  SELECT_LAWYER: {
    cond: (context) => context.repType !== "Lawyer",
    target: ".repTypeForCondoCorpSelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".repTypeForCondoCorpSelected",
    actions: "assignRepTypeInterpreter",
  },
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: {
    cond: (context) => context.repType !== "Employee for Not-for-Profit Clinic",
    target: ".repTypeForCondoCorpSelected",
    actions: "assignRepTypeEmployeeForNFPClinic",
  },
  SELECT_EMPLOYEE_OF_LEGAL_CLINIC: {
    cond: (context) => context.repType !== "Employee of Legal Clinic",
    target: ".repTypeForCondoCorpSelected",
    actions: "assignRepTypeEmployeeOfLegalClinic",
  },
};

const showingSubsection3State = {
  initial: "default",
  states: {
    default: {
      always: [
        {
          cond: (context) => context.isCoOwner,
          target: "subsection3Shown",
        },
        {
          cond: (context) => !context.isCoOwner,
          target: "endOfSection1",
        },
      ],
    },
    subsection3Shown: {
      tags: ['hasSubsection3'],
      initial: "default",
      states: {
        default: {
          tags: ['hasButton'],
          on: {
            // Add condition for checking length of Co-Owners array
            CONTINUE: {
              target: "endOfSection1",
              actions: 'assignSubsection3CompletedTrue',
            },
          },
        },
        endOfSection1: {
          type: "final",
          onEntry: 'assignSection1CompletedTrue',
          onExit: 'assignSection1CompletedFalse',
        },
      },
    },
    endOfSection1: {
      type: "final",
      onEntry: 'assignSection1CompletedTrue',
      onExit: 'assignSection1CompletedFalse',
    },
  },
};

const repTypeForPersonSelectedState = {
  tags: ['hasCoOwnersQuestion'],
  initial: "default",
  on: {
    ...setIsCoOwnerEvents,
  },
  states: {
    default: {
      tags: ['hasButton'],
      on: {
        CONTINUE: {
          cond: (context) => context.isCoOwner !== undefined,
          target: "showingSubsection3",
          actions: 'assignSubsection2CompletedTrue',
        },
      },
    },
    showingSubsection3: {
      ...showingSubsection3State,
    },
  },
};

const repTypeForLegalEntitySelectedState = repTypeForPersonSelectedState;

const repTypeForCondoCorpSelectedState = {
  initial: "default",
  states: {
    default: {
      tags: ['hasButton'],
      on: {
        CONTINUE: {
          target: 'endOfSection1',
        }
      },
    },
    endOfSection1: {
      type: 'final',
      onEntry: 'assignSection1CompletedTrue',
      onExit: 'assignSection1CompletedFalse',
    },
  },
};

const wizardMachine = createMachine(
  {
    id: "Section1Wizard",
    context: {
      subsection1Completed: false,
      subsection2Completed: false,
      subsection3Completed: false,
      section1Completed: false,
      userRole: "",
      isCoOwner: undefined,
      applicantType: "",
      repType: "",
    },
    initial: "default",
    on: {
      SELECT_APPLICANT_ROLE: [
        {
          cond: (context) => context.subsection1Completed,
          actions: "assignFilerRoleApplicant",
          target: "showingSubsection2",
        },
        { actions: "assignFilerRoleApplicant" },
      ],
      SELECT_REPRESENTATIVE_ROLE: [
        {
          cond: (context) => context.subsection1Completed,
          actions: "assignFilerRoleRepresentative",
          target: "showingSubsection2",
        },
        { actions: "assignFilerRoleRepresentative" },
      ],
    },
    states: {
      default: {
        meta: {
          title: "About You",
        },
        tags: ['hasButton'],
        on: {
          CONTINUE: {
            cond: (context) => context.userRole !== "",
            target: "showingSubsection2",
            actions: 'assignSubsection1CompletedTrue',
          },
        },
      },
      showingSubsection2: {
        meta: {
          title: "About Applicant",
        },
        initial: "default",
        states: {
          default: {
            always: [
              {
                cond: (context) => context.userRole === "Applicant",
                target: "fillingInYouAreTheApplicant",
              },
              {
                cond: (context) => context.userRole === "Representative",
                target: "fillingInYouAreTheRepresentative",
              },
            ],
          },
          fillingInYouAreTheApplicant: {
            meta: {
              flow: 1,
            },
            tags: ['hasCoOwnersQuestion'],
            initial: "default",
            on: {
              ...setIsCoOwnerEvents,
            },
            states: {
              default: {
                tags: ['hasButton'],
                on: {
                  CONTINUE: {
                    cond: (context) => context.isCoOwner !== undefined,
                    target: "showingSubsection3",
                    actions: 'assignSubsection2CompletedTrue',
                  },
                },
              },
              showingSubsection3: {
                ...showingSubsection3State,
              },
            },
          },
          fillingInYouAreTheRepresentative: {
            initial: "default",
            on: {
              SELECT_PERSON_APPLICANT_TYPE: {
                cond: (context) => context.applicantType !== "Condo Owner",
                target: ".selectingRepTypeForPerson",
                actions: "assignApplicantTypePerson",
              },
              SELECT_LEGAL_ENTITY_APPLICANT_TYPE: {
                cond: (context) => context.applicantType !== "Legal Entity",
                target: ".selectingRepTypeForLegalEntity",
                actions: "assignApplicantTypeLegalEntity",
              },
              SELECT_CONDO_CORP_APPLICANT_TYPE: {
                cond: (context) => context.applicantType !== "Condo Corp",
                target: ".selectingRepTypeForCondoCorp",
                actions: "assignApplicantTypeCondoCorp",
              },
            },
            states: {
              default: {},
              selectingRepTypeForPerson: {
                initial: "default",
                on: {
                  ...selectingRepTypeForPersonEvents,
                },
                states: {
                  default: {},
                  repTypeForPersonSelected: { 
                    ...repTypeForPersonSelectedState 
                  },
                },
              },
              selectingRepTypeForLegalEntity: {
                initial: "default",
                on: {
                  ...selectingRepTypeForLegalEntityEvents,
                },
                states: {
                  default: {},
                  repTypeForLegalEntitySelected: { 
                    ...repTypeForLegalEntitySelectedState 
                  },
                },
              },
              selectingRepTypeForCondoCorp: {
                initial: "default",
                on: {
                  ...selectingRepTypeForCondoCorpEvents,
                },
                states: {
                  default: {},
                  repTypeForCondoCorpSelected: { 
                    ...repTypeForCondoCorpSelectedState 
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignSubsection1CompletedTrue: assign({
        subsection1Completed: (context, event) => true,
      }),
      assignSubsection2CompletedTrue: assign({
        subsection2Completed: (context, event) => true,
      }),
      assignSubsection3CompletedTrue: assign({
        subsection3Completed: (context, event) => true,
      }),
      assignSection1CompletedTrue: assign({
        section1Completed: (context, event) => true,
      }),
      assignSection1CompletedFalse: assign({
        section1Completed: (context, event) => false,
      }),
      assignFilerRoleApplicant: assign({
        userRole: (context, event) => "Applicant",
        applicantType: (context, event) => "Condo Owner",
        repType: (context, event) => "",
      }),
      assignFilerRoleRepresentative: assign({
        userRole: (context, event) => "Representative",
        applicantType: (context, event) => "",
        repType: (context, event) => "",
      }),
      assignApplicantTypePerson: assign({
        applicantType: (context, event) => "Condo Owner",
      }),
      assignApplicantTypeLegalEntity: assign({
        applicantType: (context, event) => "Legal Entity",
      }),
      assignApplicantTypeCondoCorp: assign({
        applicantType: (context, event) => "Condo Corp",
      }),
      assignRepTypeLawyer: assign({
        repType: (context, event) => "Lawyer",
      }),
      assignRepTypeFriend: assign({
        repType: (context, event) => "Friend",
      }),
      assignRepTypeFamilyMember: assign({
        repType: (context, event) => "Family Member",
      }),
      assignRepTypeInterpreter: assign({
        repType: (context, event) => "Interpreter",
      }),
      assignRepTypeInHouseLegalServicesProvider: assign({
        repType: (context, event) => "In-House Legal Services Provider",
      }),
      assignRepTypeEmployeeForNFPClinic: assign({
        repType: (context, event) => "Employee for Not-for-Profit Clinic",
      }),
      assignRepTypeEmployeeOfLegalClinic: assign({
        repType: (context, event) => "Employee of Legal Clinic",
      }),
    },
  }
);
