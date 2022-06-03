const { useMachine } = XStateVue;
const { State } = XState;

const Form = {
  props: {
    
  },
  setup() {
    const stateDefinition = JSON.parse(localStorage.getItem('app-state')) || wizardMachine.initialState;
    const savedState = State.create(stateDefinition);
    const { state, send, service } = useMachine(wizardMachine, { state: savedState });

    service.onTransition((state) => {
      console.log('New State:')
      console.log(state);
      const jsonState = JSON.stringify(state);
      try {
        localStorage.setItem('app-state', jsonState);
      } catch (e) {
        console.log(e);
      }
    })

    const getButtonLabel = Vue.computed(() => {
      const nextState = wizardMachine.withContext(state.context).transition(state.value, 'CONTINUE');
      return nextState.hasTag('final') ? 'Next Section' : 'CONTINUE';
    });
    
    return { state, send, getButtonLabel };
  },
  template: /*html*/`
    <div class="container-fluid">
      <div class="row">
        <div class="col-5">
          <div class="sticky-top pt-3">
            Event:
            <pre>{{ state.event }}</pre>
            State:
            <pre>{{ state.value }}</pre>
            <pre>{{ state.done }}</pre>
            Context:
            <pre>{{ state.context }}</pre>
          </div>
        </div>
        <div class="col-7">
          <h1>1. About You and  Applicant</h1>
          <form class="card" :class="{ 'border-success': state.context.section1Completed }">
<!-- Section 1.1. About You -->
            <section class="card-body">
              <h3>1.1. About You</h3>

              <!-- Question 1 -->
              <fieldset>
                <legend>Are you the Applicant in this application or are you filing this CAT application on behalf of the Applicant?</legend>
                <div class="form-check">
                  <input
                      type="radio"
                      id="applicant-role"
                      name="role"
                      class="form-check-input"
                      value="applicant"
                      :checked="state.context.userRole === 'Applicant'"
                      @change="send('SELECT_APPLICANT_ROLE')"
                    />
                  <label for="applicant-role">I am filing this CAT application as the Applicant</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    id="representative-role"
                    name="role"
                    class="form-check-input"
                    value="representative"
                    :checked="state.context.userRole === 'Representative'"
                    @change="send('SELECT_REPRESENTATIVE_ROLE')"
                  />
                  <label for="representative-role">I am filing this CAT application as a representative of the Applicant</label>
                </div>
              </fieldset>                
            </section>

<!-- Section 1.2. The Applicant -->
            <section class="card-body" v-if="state.matches('showingSubsection2')">
              <h3>1.2. The Applicant</h3>

              <!-- You are the applicant - Question 2 -->
              <div class="" v-if="state.matches('showingSubsection2.fillingInYouAreTheApplicant')">
                Fill in your info.
              </div>

              <div class="" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')">
                <!-- You are the representative - Question 2 -->
                <fieldset>
                  <legend>Sarah, can you tell us what kind of Applicant you are representing?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="person-applicant" name="applicantType"
                        :checked="state.context.applicantType === 'Condo Owner'" value="Condo Owner"
                        @change="send('SELECT_PERSON_APPLICANT_TYPE')" />
                    <label for="person-applicant">The Applicant is the person who owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="legal-entity-applicant" name="applicantType"
                      :checked="state.context.applicantType === 'Legal Entity'" value="Legal Entity"
                      @change="send('SELECT_LEGAL_ENTITY_APPLICANT_TYPE')"
                    />
                    <label for="legal-entity-applicant">The Applicant is the legal entity that owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="condo-corp-applicant" name="applicantType"
                      :checked="state.context.applicantType === 'Condo Corp'" value="Condo Corp"
                      @change="send('SELECT_CONDO_CORP_APPLICANT_TYPE')"
                    />
                    <label for="condo-corp-applicant">The Applicant is the condominium corporation</label>
                  </div>
                </fieldset>

                <!-- You are the representative - Question 3: Condo Owner Rep-->
                <fieldset v-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative.selectingRepTypeForPerson')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" 
                      :checked="state.context.repType === 'Lawyer'" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Friend'" @change="send('SELECT_FRIEND')" />
                    <label>Friend/Neighbour</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Family Member'" @change="send('SELECT_FAMILY_MEMBER')" />
                    <label>Family Member</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Interpreter'" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpretor/Translator</label>
                  </div>
                </fieldset>
                <!-- You are the representative - Question 3: Legal Entity Rep-->
                <fieldset v-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative.selectingRepTypeForLegalEntity')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'In-House Legal Services Provider'" @change="send('SELECT_IN_HOUSE_LEGAL_SERVICES_PROVIDER')" />
                    <label>In-House Legal Services Provider</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Lawyer'" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Interpreter'" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpretor/Translator</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Employee for Not-for-Profit Clinic'" @change="send('SELECT_EMPLOYEE_FOR_NFP_CLINIC')" />
                    <label>Employee for Not-for-Profit Clinic</label>
                  </div>
                </fieldset>
                <!-- You are the representative - Question 3: Condo Corp Rep-->
                <fieldset v-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative.selectingRepTypeForCondoCorp')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Lawyer'" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Interpreter'" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpreter/Translator</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Employee for Not-for-Profit Clinic'" @change="send('SELECT_EMPLOYEE_FOR_NFP_CLINIC')" />
                    <label>Employee for Not-for-Profit Clinic</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input"
                      :checked="state.context.repType === 'Employee of Legal Clinic'" @change="send('SELECT_EMPLOYEE_OF_LEGAL_CLINIC')" />
                    <label>Employee of Legal Clinic</label>
                  </div>
                </fieldset>
              </div>

              <!-- You are the representative - Question 4: Fill in your Your Details-->
              <div class="mt-3" v-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                      && state.context.repType === 'Lawyer'">
                <h4>Lawyer/Paralegal Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'Friend'">
                <h4>Friend Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'Family Member'">
                <h4>Family Member Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'Interpreter'">
                <h4>Interpreter Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'In-House Legal Services Provider'">
                <h4>In-House Legal Services Provider Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'Employee for Not-for-Profit Clinic'">
                <h4>Employee for Not-for-Profit Clinic Details</h4>
              </div>
              <div class="mt-3" v-else-if="state.matches('showingSubsection2.fillingInYouAreTheRepresentative')
                                          && state.context.repType === 'Employee of Legal Clinic'">
                <h4>Employee of Legal Clinic Details</h4>
              </div>

              <!-- You are the representative - Question 5: Other Co-Owners?-->
              <div class="" v-if="state.hasTag('hasCoOwnersQuestion')">
                <fieldset>
                  <legend>Are there any other co-owners?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="is-co-owner" name="isCoOwner"
                        :checked="state.context.isCoOwner === true" value="true"
                        @change="($event) => send('SET_IS_CO_OWNER_TRUE')" />
                    <label for="is-co-owner">Yes</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="not-co-owner" name="isCoOwner"
                      :checked="state.context.isCoOwner === false" value="false"
                      @change="($event) => send('SET_IS_CO_OWNER_FALSE')" />
                    <label for="not-co-owner">No</label>
                  </div>
                </fieldset>
              </div>
            </section>

<!-- Section 1.3. Co-Owners -->
            <section class="card-body" v-if="state.hasTag('hasSubsection3')">
              <h3>1.3 Co-Owners</h3>
              
              <!-- Question 6: Add Co-Owners -->
              <h4>Add co-owners</h4>
            </section>

            <div class="card-body">
              <button v-if="state.hasTag('hasButton')"
                type="button" class="btn btn-primary" @click="send('CONTINUE')">
                  {{ getButtonLabel }}
              </button>
            <div>
            <!--
            <label>Select a category</label>
            <select v-model="event.category">
              <option
                v-for="option in categories"
                :value="option"
                :key="option"
                :selected="option === event.category"
              >{{ option }}</option>
            </select>

            <h3>Name & describe your event</h3>

            <label>Title</label>
            <input
              v-model="event.title"
              type="text"
              placeholder="Title"
              class="field"
            >

            <label>Description</label>
            <input
              v-model="event.description"
              type="text"
              placeholder="Description"
              class="field"
            />
            <div v-if="event.category === 'sustainability'">
              <h3>Where is your event?</h3>

              <label>Location</label>
              <input
                v-model="event.location"
                type="text"
                placeholder="Location"
                class="field"
              />
            </div>

            <h3>Are pets allowed?</h3>
            <div>
              <input
                  type="radio"
                  v-model="event.pets"
                  :value="1"
                  name="pets"
                />
              <label>Yes</label>
            </div>

            <div>
              <input
                type="radio"
                v-model="event.pets"
                :value="0"
                name="pets"
              />
              <label>No</label>
            </div>

            <h3>Extras</h3>
            <div>
              <input
                type="checkbox"
                v-model="event.extras.catering"
                class="field"
              />
              <label>Catering</label>
            </div>

            <div>
              <input
                type="checkbox"
                v-model="event.extras.music"
                class="field"
              />
              <label>Live music</label>
            </div>

            <button type="submit">Submit</button>
            -->
          </form>
        </div>
      </div>
    </div>
  `
}