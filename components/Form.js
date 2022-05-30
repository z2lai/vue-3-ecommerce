const { useMachine } = XStateVue;

const Form = {
  props: {
    
  },
  setup() {
    const { state, send } = useMachine(wizardMachine);
    // const formModel = Vue.reactive({
    //   yourRole: '',
    //   applicantType: "",
    //   isCoOwner: undefined,
    //   extras: {
    //     catering: false,
    //     music: false
    //   }
    // });
    const coOwnerScenarios = [
      'section1Expanded.subsection2Shown.youAreTheApplicant',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.lawyer',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.friend',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.familyMember',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.interpreter',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.inHouseLegalServices',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.lawyer',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.interpreter',
      'section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.employeeForNFPClinic'
    ];
    
    return { state, send, coOwnerScenarios };
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
            Context:
            <pre>{{ state.context }}</pre>
          </div>
        </div>
        <div class="col-7">
          <h1>1. About You and  Applicant</h1>
          <form>
            <section class="card">
              <div class="card-body">
                <h3>1.1. About You</h3>
<!-- Section 1: Question 1 -->
                <fieldset>
                  <legend>Are you the Applicant in this application or are you filing this CAT application on behalf of the Applicant?</legend>
                  <div class="form-check">
                    <input
                        type="radio"
                        id="applicant-role"
                        name="role"
                        class="form-check-input"
                        value="applicant"
                        :checked="state.context.yourRole === 'applicant'"
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
                      :checked="state.context.yourRole === 'representative'"
                      @change="send('SELECT_REPRESENTATIVE_ROLE')"
                    />
                    <label for="representative-role">I am filing this CAT application as a representative of the Applicant</label>
                  </div>
                </fieldset>
                
                <button v-if="state.matches('section1Expanded.subsection1Shown')" type="button" class="btn btn-primary" @click="send('CONTINUE')">Continue</button>
              </div>
            </section>

<!-- Section 2: Question 1 -->
            <section class="card" v-if="state.matches('section1Expanded.subsection2Shown')">
              <!-- 1.2. The Applicant - You are the applicant -->
              <div class="card-body" v-if="state.matches('section1Expanded.subsection2Shown.youAreTheApplicant')">
                <h3>1.2. The Applicant</h3>
                Fill in your info.
                <button type="button" class="btn btn-primary" @click="send('CONTINUE')">Continue</button>
              </div>

              <!-- 1.2. The Applicant - You are the representative -->
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative')">
                <h3>1.2. The Applicant</h3>
                <fieldset>
                  <legend>Sarah, can you tell us what kind of Applicant you are representing?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="person-applicant"
                        :checked="state.context.applicantType === 'Condo Owner Rep'" value="Condo Owner Rep"
                        @change="send('SELECT_PERSON_TYPE')" />
                    <label for="person-applicant">The Applicant is the person who owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="legal-entity-applicant"
                      :checked="state.context.applicantType === 'Legal Entity Rep'" value="Legal Entity Rep"
                      @change="send('SELECT_LEGAL_ENTITY_TYPE')"
                    />
                    <label for="legal-entity-applicant">The Applicant is the legal entity that owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="condo-corp-applicant"
                      :checked="state.context.applicantType === 'Condo Corp Rep'" value="Condo Corp Rep"
                      @change="send('SELECT_CONDO_CORP_TYPE')"
                    />
                    <label for="condo-corp-applicant">The Applicant is the condominium corporation</label>
                  </div>
                </fieldset>

<!-- Section 2: Question 2 -->
                <!-- 1.2. The Applicant - You are the representative - Condo Owner Rep-->
                <fieldset v-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_FRIEND')" />
                    <label>Friend/Neighbour</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_FAMILY_MEMBER')" />
                    <label>Family Member</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpretor/Translator</label>
                  </div>
                </fieldset>

                <!-- 1.2. The Applicant - You are the representative - Legal Entity Rep-->
                <fieldset v-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_IN_HOUSE_LEGAL_SERVICES')" />
                    <label>In-House Legal Services Provider</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpretor/Translator</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_FOR_NFP_CLINIC')" />
                    <label>Employee for Not-for-Profit Clinic</label>
                  </div>
                </fieldset>

                <!-- 1.2. The Applicant - You are the representative - Condo Corp Rep-->
                <fieldset v-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp')">
                  <legend>Sarah, in what capacity are you representing the Applicant?</legend>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_LAWYER')" />
                    <label>Lawyer/Paralegal</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_INTERPRETER')" />
                    <label>Interpretor/Translator</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_FOR_NFP_CLINIC')" />
                    <label>Employee for Not-for-Profit Clinic</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_OF_LEGAL_CLINIC')" />
                    <label>Employee of Legal Clinic</label>
                  </div>
                </fieldset>
              </div>
<!-- Section 2: Question 3 -->
              <div class="card-body" v-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.lawyer')
                                            || state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.lawyer')
                                            || state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp.lawyer')">
                <h4>Lawyer/Paralegal Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.friend')">
                <h4>Friend Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.familyMember')">
                <h4>Family Member Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForPerson.interpreter')
                                                || state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.interpreter')
                                                || state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp.interpreter')">
                <h4>Interpreter Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.inHouseLegalServices')">
                <h4>In-House Legal Services Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForLegalEntity.employeeForNFPClinic')
                                                || state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp.employeeForNFPClinic')">
                <h4>Employee for Non-for-Profit Clinic Details</h4>
              </div>
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp.employeeOfLegalClinic')">
                <h4>Employee of Legal Clinic Details</h4>
              </div>

<!-- Section 2: Question 4 -->
              <!-- 1.2. The Applicant - Other Co-Owners? -->
              <div class="card-body" v-if="coOwnerScenarios.some(state.matches)">
                <fieldset>
                  <legend>Are there any other co-owners?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="is-co-owner"
                        :checked="state.context.isCoOwner === true" value="true"
                        @change="($event) => send({ type: 'SET_IS_CO_OWNER', value: $event.target.value === 'true' })" />
                    <label for="is-co-owner">Yes</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="not-co-owner"
                      :checked="state.context.isCoOwner === false" value="false"
                      @change="($event) => send({ type: 'SET_IS_CO_OWNER', value: $event.target.value === 'true' })" />
                    <label for="not-co-owner">No</label>
                  </div>
                </fieldset>
                <button type="button" class="btn btn-primary" @click="send('CONTINUE')">Continue</button>
              </div>
            </section>

<!-- Section 3: Question 1 -->
            <section class="card">
            <!-- 1.3. Co-Owners -->
              <div class="card-body" v-if="state.matches('section1Expanded.subsection3Shown')">
                <h3>1.3 Co-Owners</h3>
                <h4>Add co-owners</h4>
                <button type="button" class="btn btn-primary" @click="send('CONTINUE')">Continue</button>
              </div>
              <div class="card-body" v-if="state.matches('section1Expanded.section1Complete')">
                <h3>Section 1 Completed!</h3>
                <button type="submit" class="btn btn-primary" @click="alert(state.context)">Continue</button>
              </div>
            </section>
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