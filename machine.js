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
    target: ".lawyerSelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_FRIEND: {
    cond: (context) => context.repType !== "Friend",
    target: ".friendSelected",
    actions: "assignRepTypeFriend",
  },
  SELECT_FAMILY_MEMBER: {
    cond: (context) => context.repType !== "Family Member",
    target: ".familyMemberSelected",
    actions: "assignRepTypeFamilyMember",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".interpreterSelected",
    actions: "assignRepTypeInterpreter",
  },
};

const selectingRepTypeForLegalEntityEvents = {
  SELECT_IN_HOUSE_LEGAL_SERVICES_PROVIDER: {
    cond: (context) => context.repType !== "In-House Legal Services Provider",
    target: ".inHouseLegalServicesProviderSelected",
    actions: "assignRepTypeInHouseLegalServicesProvider",
  },
  SELECT_LAWYER: {
    cond: (context) => context.repType !== "Lawyer",
    target: ".lawyerSelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".interpreterSelected",
    actions: "assignRepTypeInterpreter",
  },
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: {
    cond: (context) => context.repType !== "Employee for Not-for-Profit Clinic",
    target: ".employeeForNFPClinicSelected",
    actions: "assignRepTypeEmployeeForNFPClinic",
  },
};

const selectingRepTypeForCondoCorpEvents = {
  SELECT_LAWYER: {
    cond: (context) => context.repType !== "Lawyer",
    target: ".lawyerSelected",
    actions: "assignRepTypeLawyer",
  },
  SELECT_INTERPRETER: {
    cond: (context) => context.repType !== "Interpreter",
    target: ".interpreterSelected",
    actions: "assignRepTypeInterpreter",
  },
  SELECT_EMPLOYEE_FOR_NFP_CLINIC: {
    cond: (context) => context.repType !== "Employee for Not-for-Profit Clinic",
    target: ".employeeForNFPClinicSelected",
    actions: "assignRepTypeEmployeeForNFPClinic",
  },
  SELECT_EMPLOYEE_OF_LEGAL_CLINIC: {
    cond: (context) => context.repType !== "Employee of Legal Clinic",
    target: ".employeeOfLegalClinicSelected",
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
          tags: ['hasContinueButton'],
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
        },
      },
    },
    endOfSection1: {
      type: "final",
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
      tags: ['hasContinueButton'],
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
      tags: ['hasContinueButton'],
      on: {
        CONTINUE: "endOfSection1",
      },
    },
    endOfSection1: {
      type: 'final',
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
        tags: ['hasContinueButton'],
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
                tags: ['hasContinueButton'],
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
                  lawyerSelected: { ...repTypeForPersonSelectedState },
                  friendSelected: { ...repTypeForPersonSelectedState },
                  familyMemberSelected: { ...repTypeForPersonSelectedState },
                  interpreterSelected: { ...repTypeForPersonSelectedState },
                },
              },
              selectingRepTypeForLegalEntity: {
                initial: "default",
                on: {
                  ...selectingRepTypeForLegalEntityEvents,
                },
                states: {
                  default: {},
                  inHouseLegalServicesProviderSelected: { ...repTypeForLegalEntitySelectedState },
                  lawyerSelected: { ...repTypeForLegalEntitySelectedState },
                  interpreterSelected: { ...repTypeForLegalEntitySelectedState },
                  employeeForNFPClinicSelected: { ...repTypeForLegalEntitySelectedState },
                },
              },
              selectingRepTypeForCondoCorp: {
                initial: "default",
                on: {
                  ...selectingRepTypeForCondoCorpEvents,
                },
                states: {
                  default: {},
                  lawyerSelected: { ...repTypeForCondoCorpSelectedState },
                  interpreterSelected: { ...repTypeForCondoCorpSelectedState },
                  employeeForNFPClinicSelected: { ...repTypeForCondoCorpSelectedState },
                  employeeOfLegalClinicSelected: { ...repTypeForCondoCorpSelectedState },
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
      assignFilerRoleApplicant: assign({
        userRole: (context, event) => "Applicant",
        applicantType: (context, event) => "Condo Owner",
      }),
      assignFilerRoleRepresentative: assign({
        userRole: (context, event) => "Representative",
        applicantType: (context, event) => "",
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
        repType: (context, event) => "FamilyMember",
      }),
      assignRepTypeInterpreter: assign({
        repType: (context, event) => "Interpreter",
      }),
      assignRepTypeInHouseLegalServicesProvider: assign({
        repType: (context, event) => "In-House Legal Services Provider",
      }),
      assignRepTypeEmployeeForNFPClinic: assign({
        repType: (context, event) => "Employee for Not-For-Profit Clinic",
      }),
      assignRepTypeEmployeeForLegalClinic: assign({
        repType: (context, event) => "Employee for Legal Clinic",
      }),
    },
  }
);
