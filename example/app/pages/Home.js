import React from 'react'
import { Outer, Container } from 'Components/Layout'
import Header from 'Components/Header'
import Section from 'Components/Section'
import Internets from 'Components/Internets'
import Projects from 'Components/Projects'
import NestedAsync from 'Components/NestedAsync'

export default props => (
  <Outer>
    <Container>
      <Header />
      <NestedAsync />
      <Section title='Internets'>
        <Internets />
      </Section>
      <hr />
      <Section title='Open Source'>
        <Projects />
      </Section>
    </Container>
  </Outer>
)
