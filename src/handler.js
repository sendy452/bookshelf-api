const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date()
  const updatedAt = insertedAt

  const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt,
      updatedAt,
  }

  const isName = name != null
  const isPaging = readPage <= pageCount

  if (isName && isPaging) {
    books.push(newBook)
  }

  if (isName && isPaging) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    return response
  } else if (!isName) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  } else if (!isPaging) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  return null
}

const getAllBooksHandler = (request, h) => {
  const query = request.query
  const showBook = []
  let book = {}

  if (query.reading != null) {
    if (query.reading == 1) {
      book = books.filter((n) => n.reading == true)
    } else {
      book = books.filter((n) => n.reading == false)
    }
  } else if (query.finished != null) {
    if (query.finished == 1) {
      book = books.filter((n) => n.finished == true)
    } else {
      book = books.filter((n) => n.finished == false)
    }
  } else if (query.name != null) {
    book = books.filter((n) => JSON.stringify(n.name).toLowerCase()
    .indexOf(query.name.toLowerCase()) != -1)
  } else {
    book = books
  }

  book.forEach((val) => {
    showBook.push({
      id: val.id,
      name: val.name,
      publisher: val.publisher,
    })
  })

  const response = h.response({
    status: 'success',
    data: {
      books: showBook,
    },
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const params = request.params

  const book = books.filter((n) => n.id === params.bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const params = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date()

  const index = books.findIndex((n) => n.id === params.bookId)

  const isName = name != null
  const isPaging = readPage <= pageCount

  if (index !== -1) {
    if (isName && isPaging) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      }
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      response.code(200)
      return response
    } else if (!isName) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      response.code(400)
      return response
    } else if (!isPaging) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      response.code(400)
      return response
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const params = request.params

  const index = books.findIndex((n) => n.id === params.bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    response.code(200)
    return response
  }

 const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}