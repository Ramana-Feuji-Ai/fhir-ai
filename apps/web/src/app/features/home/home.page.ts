import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurriculumApi } from '../../core/curriculum.api';
import { CurriculumSummary, PhaseCard } from '../../core/models';
import { PhaseCardComponent } from '../../shared/phase-card.component';
import { Hero3DComponent } from '../../shared/hero-3d.component';

@Component({
  selector: 'fhi-home-page',
  standalone: true,
  imports: [FormsModule, RouterLink, PhaseCardComponent, Hero3DComponent],
  template: `
    @if (summary(); as s) {
      <fhi-hero-3d />

      <section class="features" id="features">
        <div class="wrap">
          <div class="sectionHead">
            <div>
              <h2>Why choose FHIR Learning Academy?</h2>
              <p class="muted">Built for implementers, by implementers — every feature designed to accelerate your FHIR mastery.</p>
            </div>
          </div>
          <div class="featureStrip">
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">▣</div>
              <h3>Video-Enhanced Lessons</h3>
              <p>Every topic includes expert-led video walkthroughs with inline timestamps, transcripts, and downloadable resources.</p>
            </article>
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">⚡</div>
              <h3>Interactive Slide Decks</h3>
              <p>SCORM-style learning with progress tracking, fullscreen mode, key points rail, and exam tips — keyboard navigable.</p>
            </article>
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">🧪</div>
              <h3>Hands-on Labs</h3>
              <p>Real FHIR server interactions: create, search, validate resources; practice with US Core, SMART, and bulk data.</p>
            </article>
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">📊</div>
              <h3>Progress Analytics</h3>
              <p>Detailed dashboards with phase completion, topic mastery, time spent, and weak-area identification.</p>
            </article>
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">🎯</div>
              <h3>Blueprint-Aligned</h3>
              <p>Content mapped to HL7 FHIR R4 certification blueprint — R4B/R5 readiness modules included.</p>
            </article>
            <article class="featureTile">
              <div class="ftIcon" aria-hidden="true">🔒</div>
              <h3>Secure & Private</h3>
              <p>No data leaves your environment. Self-hosted option with SSO integration for enterprise teams.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="content pathway" id="pathway">
        <div class="wrap">
          <div class="sectionHead">
            <div>
              <p class="sectionEyebrow">Map</p>
              <h2>Learning pathway</h2>
              <p class="muted">The recommended journey in four stages. Use this as the order of study — it is not a list of every phase.</p>
            </div>
          </div>
          <div class="steps">
            @for (stage of learningStages(); track stage.id) {
              <article class="step">
                <b>{{ stage.number }}</b>
                <h3>{{ stage.title }}</h3>
                <p>{{ stage.description }}</p>
                <ul class="stageTopics">
                  @for (topic of stage.topics; track topic) {
                    <li>{{ topic }}</li>
                  }
                </ul>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="catalog" id="curriculum">
        <div class="wrap">
          <div class="catalogHead">
            <div>
              <p class="sectionEyebrow">Catalog</p>
              <h2>{{ s.phaseCount }}-phase curriculum</h2>
              <p class="muted">Every phase you can open. Filter by track or search, then start a phase. This is the full catalog; the pathway above is only the suggested sequence.</p>
            </div>
            <span class="muted">{{ resultLabel() }}</span>
          </div>

          <div class="trackBoard">
            <button type="button" class="trackChip" [class.on]="selectedTrack() === 'All tracks'" (click)="selectTrack('All tracks')">
              <b>All tracks</b><span>{{ s.phaseCount }} phases</span>
            </button>
            @for (t of s.tracks; track t.track) {
              <button type="button" class="trackChip" [class.on]="selectedTrack() === t.track" (click)="selectTrack(t.track)">
                <b>{{ t.track }}</b><span>{{ t.phaseCount }} phases</span>
              </button>
            }
          </div>

          <div class="tools">
            <label class="searchbox">
              <span>⌕</span>
              <input type="search" placeholder="Search phases and topics" [(ngModel)]="query" (ngModelChange)="reload()" aria-label="Search phases and topics" />
            </label>
            <select [ngModel]="selectedTrack()" (ngModelChange)="selectTrack($event)" aria-label="Filter by track">
              <option>All tracks</option>
              @for (t of s.tracks; track t.track) {
                <option [value]="t.track">{{ t.track }}</option>
              }
            </select>
          </div>

          <div class="grid">
            @for (p of phases(); track p.id) {
              <fhi-phase-card [phase]="p" />
            }
          </div>
        </div>
      </section>

      <section class="testimonials" id="testimonials">
        <div class="wrap">
          <div class="sectionHead">
            <h2>Trusted by Implementers Worldwide</h2>
            <p class="muted">Hear from developers, architects, and clinical informaticists who've accelerated their FHIR journey.</p>
          </div>
          <div class="testimonialGrid">
            @for (t of testimonials(); track t.id) {
              <article class="testimonialCard">
                <div class="stars" aria-label="{{ t.rating }} out of 5 stars">★★★★★</div>
                <p class="quote">"{{ t.quote }}"</p>
                <div class="author">
                  <div class="avatar" style="background: {{ t.avatarColor }}">{{ t.initials }}</div>
                  <div>
                    <b>{{ t.name }}</b>
                    <span>{{ t.role }}</span>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="ctaFinal" id="get-started">
        <div class="wrap">
          <div class="ctaCard">
            <div class="ctaContent">
              <h2>Ready to master FHIR?</h2>
              <p>Join 2,800+ implementers. Start Phase 0 free — no credit card required.</p>
              <div class="ctaActions">
                <a class="btn primary" routerLink="/phase/0">Start Learning Free</a>
                <a class="btn secondary" routerLink="/" fragment="curriculum">View Full Curriculum</a>
              </div>
              <p class="ctaNote">Includes: Video lessons · Interactive slides · Hands-on labs · Progress tracking · Certificate of completion</p>
            </div>
          </div>
        </div>
      </section>

    } @else if (error()) {
      <div class="wrap" style="padding:48px 28px">
        <p>Could not load curriculum. Is the API running on port 18081?</p>
        <pre class="muted">{{ error() }}</pre>
      </div>
    } @else {
      <div class="wrap" style="padding:48px 28px"><p class="muted">Loading academy…</p></div>
    }
  `,
  styles: `
    .ctaRow {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 28px;
      align-items: center;
    }
    .ctaRow .btn {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .overallProgress {
      justify-self: end;
      width: min(100%, 280px);
    }
    @media (max-width: 900px) {
      .overallProgress {
        justify-self: stretch;
        width: 100%;
      }
    }
    .features {
      padding: 80px 0;
      background: linear-gradient(180deg, #F7FAFC 0%, #FFFFFF 100%);
      border-bottom: 1px solid var(--g3);
    }
    .pathway {
      padding: 80px 0;
      background: #FFFFFF;
    }
    .sectionEyebrow {
      margin: 0 0 6px;
      font-size: 11px;
      font-weight: 650;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--o7);
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 32px;
    }
    .step {
      position: relative;
      background: white;
      border: 1px solid #D7E2EC;
      border-radius: 16px;
      padding: 28px 24px 24px;
      box-shadow: 0 1px 2px rgba(11, 28, 44, .03);
      overflow: hidden;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .step:hover {
      transform: translateY(-4px);
      border-color: #C5DBEF;
      box-shadow: 0 12px 32px rgba(11, 28, 44, .08);
    }
    .step::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 4px;
      background: linear-gradient(90deg, var(--o7), var(--b6));
    }
    .step b {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      height: 32px;
      padding: 0 12px;
      border-radius: 999px;
      background: var(--n0);
      color: var(--n7);
      font-size: 13px;
      letter-spacing: 0.06em;
      font-weight: 650;
      margin-bottom: 16px;
    }
    .step h3 {
      margin: 0 0 10px;
      font-family: var(--display);
      font-size: 20px;
      color: var(--n9);
    }
    .step p {
      font-size: 14px;
      color: var(--n6);
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .stageTopics {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .stageTopics li {
      font-size: 12px;
      color: var(--n5);
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
      border-bottom: 1px solid var(--n1);
    }
    .stageTopics li:last-child {
      border-bottom: none;
    }
    .stageTopics li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--b6);
      font-weight: 600;
    }
    .catalog {
      padding: 80px 0;
      background: linear-gradient(180deg, #EEF3F7, #F7F9FB);
      border-top: 1px solid var(--g3);
    }
    .testimonials {
      padding: 80px 0;
      background: #FFFFFF;
    }
    .testimonialGrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 32px;
    }
    .testimonialCard {
      background: white;
      border: 1px solid #D7E2EC;
      border-radius: 16px;
      padding: 24px;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .testimonialCard:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(11, 28, 44, .08);
      border-color: #C5DBEF;
    }
    .stars {
      font-size: 16px;
      color: #E0A06A;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }
    .quote {
      font-size: 14px;
      line-height: 1.7;
      color: var(--n8);
      margin: 0 0 20px;
      font-style: italic;
    }
    .author {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .author .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: white;
      font-weight: 700;
      font-size: 14px;
    }
    .author b {
      display: block;
      font-size: 14px;
      color: var(--n9);
    }
    .author span {
      display: block;
      font-size: 12px;
      color: var(--n5);
    }
    .ctaFinal {
      padding: 80px 0;
      background: linear-gradient(180deg, #0B1C2C, #14304A);
    }
    .ctaCard {
      background: linear-gradient(135deg, rgba(224,160,106,0.12), rgba(26,107,184,0.12));
      border: 1px solid rgba(224,160,106,0.3);
      border-radius: 20px;
      padding: 48px;
      text-align: center;
      max-width: 720px;
      margin: 0 auto;
    }
    .ctaContent h2 {
      font-family: var(--display);
      font-size: clamp(28px, 4vw, 38px);
      color: white;
      margin: 0 0 16px;
    }
    .ctaContent p {
      color: rgba(255,255,255,0.8);
      font-size: 16px;
      margin: 0 0 28px;
    }
    .ctaActions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      margin-bottom: 20px;
    }
    .ctaNote {
      font-size: 13px;
      color: rgba(255,255,255,0.55);
      margin: 0;
    }
    @media (max-width: 1000px) {
      .steps {
        grid-template-columns: repeat(2, 1fr);
      }
      .testimonialGrid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 767px) {
      .steps {
        grid-template-columns: 1fr;
      }
      .testimonialGrid {
        grid-template-columns: 1fr;
      }
      .ctaCard {
        padding: 32px 20px;
      }
      .featureStrip {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class HomePage implements OnInit {
  private readonly api = inject(CurriculumApi);

  readonly summary = signal<CurriculumSummary | null>(null);
  readonly phases = signal<PhaseCard[]>([]);
  readonly selectedTrack = signal('All tracks');
  readonly error = signal<string | null>(null);
  query = '';

  readonly learningStages = signal<LearningStage[]>([
    {
      id: 'foundations',
      number: '01',
      title: 'Foundations',
      description: 'Core FHIR concepts, resource structure, RESTful API basics, and terminology services.',
      topics: [
        'FHIR Overview & History',
        'Resource Structure & Elements',
        'RESTful API Fundamentals',
        'Search & _include/_revinclude',
        'Terminology & ValueSets',
        'Profiles & Conformance',
      ],
    },
    {
      id: 'implementation',
      number: '02',
      title: 'Implementation',
      description: 'US Core, SMART on FHIR, Bulk Data, and real-world implementation patterns.',
      topics: [
        'US Core Profiles',
        'SMART App Launch',
        'Bulk Data Export',
        'FHIR Subscriptions',
        'Provenance & AuditEvent',
        'Validation & Troubleshooting',
      ],
    },
    {
      id: 'advanced',
      number: '03',
      title: 'Advanced Topics',
      description: 'Clinical reasoning, CDS Hooks, FHIRPath, CQL, and advanced security patterns.',
      topics: [
        'Clinical Decision Support',
        'FHIRPath & CQL',
        'CDS Hooks Integration',
        'Advanced Security (SMART/OAuth2)',
        'Terminology Services',
        'Mapping & Transformations',
      ],
    },
    {
      id: 'readiness',
      number: '04',
      title: 'Certification Readiness',
      description: 'Mock exams, lab assessments, and final preparation for HL7 FHIR R4 certification.',
      topics: [
        'Practice Exam Questions',
        'Timed Mock Exams',
        'Lab Performance Assessment',
        'Weak Area Remediation',
        'Exam Day Strategies',
        'Continuing Education Path',
      ],
    },
  ]);

  readonly testimonials = signal<Testimonial[]>([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior FHIR Architect, HealthTech Inc.',
      quote: 'The video lessons combined with hands-on labs gave me confidence to pass the R4 certification on my first attempt. The exam tips alone are worth it.',
      rating: 5,
      initials: 'SC',
      avatarColor: '#B85A12',
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Clinical Informaticist, Regional Hospital',
      quote: 'Finally, a FHIR course that understands implementers. The SMART on FHIR and Bulk Data modules saved me weeks of trial-and-error.',
      rating: 5,
      initials: 'MJ',
      avatarColor: '#3B8FD4',
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Software Engineer, EHR Vendor',
      quote: 'The progress tracking kept me accountable. I completed all 16 phases in 8 weeks while working full-time. Highly recommend!',
      rating: 5,
      initials: 'PP',
      avatarColor: '#4CAF7A',
    },
  ]);

  ngOnInit(): void {
    this.api.summary().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.reload();
      },
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }

  resultLabel(): string {
    const n = this.phases().length;
    return `${n} phase${n === 1 ? '' : 's'}`;
  }

  selectTrack(track: string): void {
    this.selectedTrack.set(track);
    this.reload();
  }

  reload(): void {
    const track = this.selectedTrack();
    this.api.phases(track === 'All tracks' ? undefined : track, this.query || undefined).subscribe({
      next: (list) => this.phases.set(list),
      error: (e) => this.error.set(String(e?.message ?? e)),
    });
  }
}

interface LearningStage {
  id: string;
  number: string;
  title: string;
  description: string;
  topics: string[];
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  avatarColor: string;
}
