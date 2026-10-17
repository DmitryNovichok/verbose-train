---
id: improper-integral
title: Несобственные интегралы
level: 2
module: Математический анализ: интегралы
hours: 3
prereq: definite-integral
summary: Интегралы по бесконечному промежутку и от неограниченных функций, эталонные интегралы, признаки сравнения, абсолютная и условная сходимость, интеграл Пуассона и гамма-функция.
---

## Бесконечный промежуток

Площадь под кривой, уходящей в бесконечность, может быть конечной. Определяем через предел:
$$\int_a^{+\infty}f(x)\,dx=\lim_{b\to+\infty}\int_a^bf(x)\,dx.$$
Если предел конечен, интеграл **сходится**, иначе **расходится**.

:::example Вычислите $\int_1^{+\infty}\dfrac{dx}{x^2}$.
$\int_1^b\frac{dx}{x^2}=1-\frac1b\to1$. Сходится, равен 1.
:::

:::example Исследуйте $\int_1^{+\infty}\dfrac{dx}{x}$.
$\ln b\to\infty$ — расходится, хотя $\frac1x\to0$. Убывания к нулю недостаточно — нужно убывать **быстро**.
:::

## Неограниченная функция

Если $f$ неограничена вблизи точки $b$:
$$\int_a^bf(x)\,dx=\lim_{\varepsilon\to0+}\int_a^{b-\varepsilon}f(x)\,dx.$$

$\int_0^1\frac{dx}{\sqrt x}=2\sqrt x\Big|_0^1=2$ — сходится, хотя функция в нуле бесконечна.

## Эталонные интегралы

:::thm Сходимость степенных интегралов
$\displaystyle\int_1^{\infty}\frac{dx}{x^p}$ сходится при $p>1$ и расходится при $p\le1$.

$\displaystyle\int_0^1\frac{dx}{x^p}$ сходится при $p<1$ и расходится при $p\ge1$.
:::

Граница — $p=1$. На бесконечности функция должна убывать быстрее $\frac1x$, у нуля — расти медленнее $\frac1x$.

## Признаки сравнения

Часто интеграл не вычисляется, но нужно знать, сходится ли он.

:::thm Признак сравнения
Пусть $0\le f\le g$. Если $\int g$ сходится, то и $\int f$ сходится. Если $\int f$ расходится, то и $\int g$ расходится.

**Предельная форма**: если $\frac fg\to c$, $0<c<\infty$, интегралы сходятся или расходятся одновременно.
:::

:::example Сходится ли $\int_1^\infty\dfrac{x\,dx}{x^3+1}$?
На бесконечности $\frac{x}{x^3+1}\sim\frac1{x^2}$, а $\int\frac{dx}{x^2}$ сходится. Значит, сходится.
:::

**Абсолютная сходимость**: если сходится $\int|f|$, то сходится и $\int f$. Бывает **условная** сходимость: $\int_1^\infty\frac{\sin x}xdx$ сходится, а $\int_1^\infty\frac{|\sin x|}xdx$ — нет.

## Важные интегралы

**Интеграл Пуассона** (Гаусса):
$$\int_{-\infty}^{+\infty}e^{-x^2}dx=\sqrt\pi.$$
Первообразная не элементарна, но интеграл по всей прямой вычисляется переходом к двойному интегралу в полярных координатах (тема второго курса). Это нормировка нормального распределения.

**Гамма-функция** — обобщение факториала:
$$\Gamma(s)=\int_0^\infty x^{s-1}e^{-x}dx,\qquad\Gamma(n+1)=n!,\qquad\Gamma\left(\tfrac12\right)=\sqrt\pi.$$

[[plot exp(-x^2); 1/(1+x^2) | -4 4 -0.1 1.2]]

Обе кривые дают конечную площадь: $\sqrt\pi\approx1{,}77$ под колоколом Гаусса и $\pi$ под «ведьмой Аньези» $\frac1{1+x^2}$.

:::formulas
- $\int_a^\infty f\,dx=\lim\limits_{b\to\infty}\int_a^bf\,dx$ — несобственный интеграл I рода
- $\int_1^\infty\dfrac{dx}{x^p}$ сходится $\iff p>1$ — эталон на бесконечности
- $\int_0^1\dfrac{dx}{x^p}$ сходится $\iff p<1$ — эталон у нуля
- $\int_{-\infty}^\infty e^{-x^2}dx=\sqrt\pi$ — интеграл Пуассона
- $\Gamma(n+1)=\int_0^\infty x^ne^{-x}dx=n!$ — гамма-функция
:::

@tasks

@task num 1
Вычислите $\displaystyle\int_1^{\infty}\frac{dx}{x^3}$.
@answer 1/2
@solution
$-\frac1{2x^2}\Big|_1^\infty=\frac12$.

@task num 1
Вычислите $\displaystyle\int_0^{\infty}e^{-2x}dx$.
@answer 1/2
@solution
$-\frac12e^{-2x}\Big|_0^\infty=\frac12$.

@task num 1
Вычислите $\displaystyle\int_0^1\frac{dx}{\sqrt x}$.
@answer 2
@solution
$2\sqrt x\Big|_0^1=2$.

@task num 2
Вычислите $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{1+x^2}$. Ответ с `pi`.
@answer pi
@solution
$\arctg x\Big|_{-\infty}^{\infty}=\frac\pi2-\left(-\frac\pi2\right)=\pi$.

@task choice 1
Как ведёт себя интеграл $\displaystyle\int_1^{\infty}\frac{dx}{\sqrt x}$?
@opt сходится к 2
@opt* расходится
@opt сходится к 1
@solution
$p=\frac12\le1$ — расходится.

@task num 2
Вычислите $\displaystyle\int_0^{\infty}xe^{-x}dx$.
@answer 1
@solution
По частям или $\Gamma(2)=1!=1$.

@task num 2
Вычислите $\displaystyle\int_0^1\ln x\,dx$.
@answer -1
@solution
$(x\ln x-x)\Big|_0^1=-1$ (так как $x\ln x\to0$ при $x\to0$).

@task choice 2
Какой из интегралов сходится?
@opt $\int_1^\infty\dfrac{dx}{x+1}$
@opt* $\int_1^\infty\dfrac{dx}{x^2+x}$
@opt $\int_0^1\dfrac{dx}{x^2}$
@opt $\int_1^\infty\dfrac{x\,dx}{x^2+1}$
@solution
$\frac{1}{x^2+x}\sim\frac1{x^2}$ — сходится. Остальные ведут себя как $\frac1x$ на бесконечности или $\frac1{x^2}$ у нуля.

@task num 2
Вычислите $\displaystyle\int_{-\infty}^{\infty}e^{-x^2}dx$. Ответ через `sqrt` и `pi`.
@answer sqrt(pi)
@solution
Интеграл Пуассона.

@task num 3
Вычислите $\displaystyle\int_2^{\infty}\frac{dx}{x\ln^2x}$. Ответ через `ln`.
@answer 1/ln(2)
@solution
$\int\frac{d(\ln x)}{\ln^2x}=-\frac1{\ln x}$. От 2 до $\infty$: $0+\frac{1}{\ln2}$.

@task num 3
Вычислите $\displaystyle\int_0^{\infty}x^3e^{-x}dx$.
@answer 6
@solution
$\Gamma(4)=3!=6$.
