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
    
    return { state, send };
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
            Data:
            <pre>{{ state.context }}</pre>
          </div>
        </div>
        <div class="col-7">
          <h1>1. About You and  Applicant</h1>
          <form>
            <section class="card">
              <div class="card-body">
                <h3>1.1. About You</h3>
                <fieldset>
                  <legend>Are you the Applicant in this application or are you filing this CAT application on behalf of the Applicant?</legend>
                  <div class="form-check">
                    <input
                        type="radio"
                        class="form-check-input"
                        v-model="state.context.yourRole"
                        value="applicant"
                        name="role"
                        id="applicant-role"
                        @change="send('SELECT_APPLICANT_ROLE')"
                      />
                    <label for="applicant-role">I am filing this CAT application as the Applicant</label>
                  </div>
                  <div class="form-check">
                    <input
                      type="radio"
                      class="form-check-input"
                      v-model="state.context.yourRole"
                      value="representative"
                      name="role"
                      id="representative-role"
                      @change="send('SELECT_REPRESENTATIVE_ROLE')"
                    />
                    <label for="representative-role">I am filing this CAT application as a representative of the Applicant</label>
                  </div>
                </fieldset>
                
                <button type="button" class="btn btn-primary" @click="send('CONTINUE')">Continue</button>
              </div>
            </section>

            <section class="card">
              <!-- 1.2. The Applicant - You are the applicant -->
              <div class="card-body" v-if="state.matches('section1Expanded.subsection2Shown.youAreTheApplicant')">
                applicant
              </div>

              <!-- 1.2. The Applicant - You are the representative -->
              <div class="card-body" v-else-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative')">
                <h3>1.2. The Applicant</h3>
                <fieldset>
                  <legend>Sarah, can you tell us what kind of Applicant you are representing?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="person-applicant"
                        v-model="state.context.applicantType" value="Condo Owner Rep"
                        @change="send('SELECT_PERSON_TYPE')" />
                    <label for="person-applicant">The Applicant is the person who owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="legal-entity-applicant"
                      v-model="state.context.applicantType" value="Legal Entity Rep"
                      @change="send('SELECT_LEGAL_ENTITY_TYPE')"
                    />
                    <label for="legal-entity-applicant">The Applicant is the legal entity that owns the condominium unit</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="condo-corp-applicant"
                      v-model="state.context.applicantType" value="Condo Corp Rep"
                      @change="send('SELECT_CONDO_CORP_TYPE')"
                    />
                    <label for="condo-corp-applicant">The Applicant is the condominium corporation</label>
                  </div>
                </fieldset>

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
                    <label>Friend/Neighbour</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_FOR_NFP')" />
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
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_FOR_NFP')" />
                    <label>Employee for Not-for-Profit Clinic</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="rep-type" class="form-check-input" @change="send('SELECT_EMPLOYEE_OF_LEGAL_CLINIC')" />
                    <label>Employee of Legal Clinic</label>
                  </div>
                </fieldset>

                <!-- 1.2. The Applicant - Other Co-Owners? -->
                <fieldset v-if="state.matches('section1Expanded.subsection2Shown.youAreTheRepresentative.selectingRepTypeForCondoCorp')">
                  <legend>Are there any other co-owners?</legend>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="is-co-owner"
                        v-model="state.context.isCoOwner" :value="true"
                        @change="send('SET_IS_CO_OWNER_TRUE')" />
                    <label for="is-co-owner">Yes</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" class="form-check-input" id="not-co-owner"
                      v-model="state.context.isCoOwner" :value="false"
                      @change="send('SET_IS_CO_OWNER_FALSE')"
                    />
                    <label for="not-co-owner">No</label>
                  </div>
                </fieldset>
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