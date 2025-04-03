import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../pages/index'
import { useStripe } from '@stripe/stripe-react-components'

// Mock do useStripe
jest.mock('@stripe/stripe-react-components', () => ({
  useStripe: jest.fn(),
}))

// Mock do axios
jest.mock('axios', () => ({
  post: jest.fn(),
}))

describe('Home', () => {
  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks()
    
    // Mock do useStripe
    ;(useStripe as jest.Mock).mockReturnValue({
      redirectToCheckout: jest.fn(),
    })
  })

  it('renderiza a página inicial corretamente', () => {
    render(<Home />)
    
    expect(screen.getByText('Processador de Documentos')).toBeInTheDocument()
    expect(screen.getByText('Selecione um documento')).toBeInTheDocument()
    expect(screen.getByText('Plano Básico')).toBeInTheDocument()
    expect(screen.getByText('Plano Pro')).toBeInTheDocument()
  })

  it('permite selecionar um arquivo', () => {
    render(<Home />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText('Selecione um documento')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(input.files[0]).toBe(file)
  })

  it('processa um documento quando o botão é clicado', async () => {
    const mockResponse = { data: { message: 'Documento processado com sucesso' } }
    require('axios').post.mockResolvedValueOnce(mockResponse)
    
    render(<Home />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText('Selecione um documento')
    
    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Processar Documento'))
    
    await waitFor(() => {
      expect(screen.getByText('Documento processado com sucesso')).toBeInTheDocument()
    })
  })

  it('redireciona para o checkout do Stripe ao clicar em assinar', async () => {
    const mockResponse = { data: { sessionId: 'test_session_id' } }
    require('axios').post.mockResolvedValueOnce(mockResponse)
    
    render(<Home />)
    
    fireEvent.click(screen.getByText('Assinar', { selector: 'button' }))
    
    await waitFor(() => {
      expect(useStripe().redirectToCheckout).toHaveBeenCalledWith({
        sessionId: 'test_session_id',
      })
    })
  })
}) 